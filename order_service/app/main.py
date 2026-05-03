import os
import asyncio
import logging
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from .routes import router
from .auth_routes import router as auth_router
from .kafka_producer import close_producer
from .auth import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

db = None

def get_database():
    return db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Order Service...")
    client = AsyncIOMotorClient(MONGO_URI)
    db_instance = client.microbooks_orders
    
    # Cap nhat vao bien global db va app state
    global db
    db = db_instance
    app.state.db = db_instance
    logger.info("Connected to MongoDB (microbooks_orders)")

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_name = os.getenv("ADMIN_NAME", "Admin")
    if admin_email and admin_password:
        existing_admin = await db_instance.users.find_one({"email": admin_email.lower()})
        if not existing_admin:
            now = datetime.now(timezone.utc).isoformat()
            await db_instance.users.insert_one({
                "name": admin_name,
                "email": admin_email.lower(),
                "password_hash": hash_password(admin_password),
                "role": "admin",
                "created_at": now,
                "updated_at": now,
            })
            logger.info("Seeded admin user")

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
app.include_router(auth_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "order-service"}
