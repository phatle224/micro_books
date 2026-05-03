import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from .routes import router
from .kafka_consumer import consume_order_events
from .seeder import seed_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

db = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Inventory Service...")
    client = AsyncIOMotorClient(MONGO_URI)
    db_instance = client.microbooks_inventory

    global db
    db = db_instance
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


app = FastAPI(
    title="MicroBooks - Inventory Service",
    description="Book inventory management service for MicroBooks e-commerce bookstore",
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
    return {"status": "healthy", "service": "inventory-service"}
