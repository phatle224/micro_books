import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from .routes import router
from .kafka_consumer import consume_order_events
from .seeder import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

db = None

def get_database():
    return db


def configure_telemetry(service_name: str) -> bool:
    if os.getenv("OTEL_ENABLED", "false").lower() != "true":
        return False

    endpoint_base = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://otel-collector:4318")
    resource = Resource.create(
        {
            "service.name": service_name,
            "service.namespace": os.getenv("OTEL_SERVICE_NAMESPACE", "microbooks"),
            "service.version": "1.0.0",
        }
    )

    tracer_provider = TracerProvider(resource=resource)
    span_exporter = OTLPSpanExporter(endpoint=f"{endpoint_base}/v1/traces")
    tracer_provider.add_span_processor(BatchSpanProcessor(span_exporter))
    trace.set_tracer_provider(tracer_provider)

    metric_exporter = OTLPMetricExporter(endpoint=f"{endpoint_base}/v1/metrics")
    metric_reader = PeriodicExportingMetricReader(
        metric_exporter,
        export_interval_millis=10000,
    )
    meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
    metrics.set_meter_provider(meter_provider)

    HTTPXClientInstrumentor().instrument()
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Inventory Service...")
    client = AsyncIOMotorClient(MONGO_URI)
    db_instance = client.microbooks_inventory

    global db
    db = db_instance
    app.state.db = db_instance
    logger.info("Connected to MongoDB (microbooks_inventory)")

    # Run seeder
    await seed_database(db_instance)

    # Start Kafka consumer as background task
    consumer_task = asyncio.create_task(consume_order_events(db_instance))
    logger.info("Kafka consumer background task started")

    yield

    # Shutdown
    from .kafka_producer import close_producer
    await close_producer()
    consumer_task.cancel()
    client.close()
    logger.info("Inventory Service stopped")


telemetry_enabled = configure_telemetry(os.getenv("OTEL_SERVICE_NAME", "inventory-service"))

app = FastAPI(
    title="MicroBooks - Inventory Service",
    description="Book inventory management service for MicroBooks e-commerce bookstore",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False,
)

if telemetry_enabled:
    FastAPIInstrumentor.instrument_app(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "inventory-service"}
