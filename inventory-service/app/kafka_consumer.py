import os
import json
import asyncio
import logging
from aiokafka import AIOKafkaConsumer

logger = logging.getLogger(__name__)

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")


async def consume_order_events(db):
    """Consume order_created events from Kafka and deduct inventory."""
    consumer = None
    while True:
        try:
            consumer = AIOKafkaConsumer(
                "order_created",
                bootstrap_servers=KAFKA_BROKER,
                group_id="inventory-service-group",
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="earliest",
            )
            await consumer.start()
            logger.info(f"Kafka consumer started, listening on 'order_created' topic")

            async for message in consumer:
                order_data = message.value
                logger.info(f"Received order_created event: {order_data.get('_id', 'unknown')}")

                # Deduct inventory for each item in the order
                order_id = order_data.get("_id")
                stock_success = True
                failure_reason = ""

                for item in order_data.get("items", []):
                    book_id = item.get("book_id")
                    quantity = item.get("quantity", 0)

                    if book_id and quantity > 0:
                        from bson import ObjectId
                        try:
                            result = await db.books.update_one(
                                {"_id": ObjectId(book_id), "stock": {"$gte": quantity}},
                                {"$inc": {"stock": -quantity}}
                            )
                            if result.modified_count > 0:
                                logger.info(f"Deducted {quantity} from book {book_id}")
                            else:
                                logger.warning(f"Insufficient stock for book {book_id}")
                                stock_success = False
                                failure_reason = f"Out of stock: {item.get('title', 'Unknown book')}"
                                break
                        except Exception as e:
                            logger.error(f"Error deducting stock for {book_id}: {e}")
                            stock_success = False
                            failure_reason = "Database error in inventory"
                            break

                if not stock_success:
                    from .kafka_producer import publish_stock_failed
                    await publish_stock_failed(order_id, failure_reason)
                else:
                    # Optional: Publish a success event if needed
                    logger.info(f"Inventory reserved successfully for order {order_id}")

        except Exception as e:
            logger.error(f"Kafka consumer error: {e}")
            if consumer:
                await consumer.stop()
            logger.info("Retrying Kafka connection in 5 seconds...")
            await asyncio.sleep(5)
