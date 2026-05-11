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
        p = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8"),
        )
        await p.start()
        producer = p
        logger.info(f"Kafka producer connected to {KAFKA_BROKER}")
    return producer


async def publish_order_created(order_data: dict):
    """Publish order_created event to Kafka topic."""
    try:
        p = await get_producer()
        await p.send_and_wait("order_created", value=order_data)
        logger.info(f"Published order_created event for order {order_data.get('_id', 'unknown')}")
    except Exception as e:
        logger.error(f"Failed to publish order_created event: {e}")
        raise


async def publish_order_updated(order_id: str, status: str, reason: str = ""):
    """Publish order_updates event to Kafka topic (Admin/System updates)."""
    try:
        p = await get_producer()
        event = {
            "order_id": order_id,
            "status": status,
            "reason": reason
        }
        await p.send_and_wait("order_updates", value=event)
        logger.info(f"Published order_updates event for order {order_id} with status {status}")
    except Exception as e:
        logger.error(f"Failed to publish order_updates event: {e}")


async def close_producer():
    global producer
    if producer:
        try:
            await producer.stop()
        except Exception as e:
            logger.warning(f"Error closing Kafka producer: {e}")
        finally:
            producer = None
            logger.info("Kafka producer closed")
