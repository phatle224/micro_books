import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from .routes import router
from .kafka_producer import close_producer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

db = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global db
    # Startup
    logger.info("Starting Order Service...")
    client = AsyncIOMotorClient(MONGO_URI)
    db_instance = client.microbooks_orders
    # Make db accessible to routes
    import app.main as main_module
    main_module.db = db_instance
    logger.info("Connected to MongoDB (microbooks_orders)")

    # Start Kafka Consumer in background
    from .kafka_consumer import consume_order_updates
    asyncio.create_task(consume_order_updates(db_instance))
    logger.info("Background Kafka consumer started")

    yield
    # Shutdown
    await close_producer()
    client.close()
    logger.info("Order Service stopped")


app = FastAPI(
    title="MicroBooks - Order Service",
    description="Order management service for MicroBooks e-commerce bookstore",
    version="1.0.0",
    lifespan=lifespan,
)

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
    return {"status": "healthy", "service": "order-service"}
