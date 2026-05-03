import os
import json
import asyncio
import logging
from aiokafka import AIOKafkaConsumer
from bson import ObjectId

logger = logging.getLogger(__name__)
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")

async def consume_order_updates(db):
    """Consume events to update order status (e.g., from inventory or payment)."""
    consumer = None
    while True:
        try:
            consumer = AIOKafkaConsumer(
                "order_updates",
                bootstrap_servers=KAFKA_BROKER,
                group_id="order-service-updates-group",
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="earliest",
            )
            await consumer.start()
            logger.info("Kafka consumer for 'order_updates' started")

            async for message in consumer:
                update_data = message.value
                order_id = update_data.get("order_id")
                new_status = update_data.get("status")
                reason = update_data.get("reason", "")

                if order_id and new_status:
                    logger.info(f"Updating order {order_id} to {new_status}. Reason: {reason}")
                    try:
                        await db.orders.update_one(
                            {"_id": ObjectId(order_id)},
                            {"$set": {"status": new_status, "cancel_reason": reason, "updated_at": "now"}}
                        )
                    except Exception as e:
                        logger.error(f"Failed to update order {order_id}: {e}")

        except Exception as e:
            logger.error(f"Order updates consumer error: {e}")
            if consumer:
                await consumer.stop()
            await asyncio.sleep(5)
