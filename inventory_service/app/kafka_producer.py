import os
import json
import logging
from aiokafka import AIOKafkaProducer

logger = logging.getLogger(__name__)
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")

producer = None

async def get_producer():
    global producer
    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )
        await producer.start()
    return producer

async def publish_stock_failed(order_id, reason):
    """Publish an event when stock deduction fails."""
    try:
        p = await get_producer()
        event = {
            "order_id": str(order_id),
            "status": "cancelled",
            "reason": reason
        }
        await p.send_and_wait("order_updates", event)
        logger.info(f"Published stock_failed event for order {order_id}")
    except Exception as e:
        logger.error(f"Failed to publish stock_failed event: {e}")

async def publish_stock_success(order_id):
    """Publish an event when stock is successfully deducted."""
    try:
        p = await get_producer()
        event = {
            "order_id": str(order_id),
            "status": "confirmed",
            "reason": "Inventory reserved successfully"
        }
        await p.send_and_wait("order_updates", event)
        logger.info(f"Published stock_success event for order {order_id}")
    except Exception as e:
        logger.error(f"Failed to publish stock_success event: {e}")

async def close_producer():
    if producer:
        await producer.stop()
