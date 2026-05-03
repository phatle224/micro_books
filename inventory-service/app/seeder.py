import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

MOCK_BOOKS = [
    {
        "title": "The Art of Doing Science and Engineering",
        "author": "Richard W. Hamming",
        "description": "Highly accessible treatment covers consilience, error-correcting codes, information theory, digital filters and signal processing, much more.",
        "price": 29.99,
        "stock": 50,
        "category": "Technology",
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-1733646506"
    },
    {
        "title": "Designing Data-Intensive Applications",
        "author": "Martin Kleppmann",
        "description": "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.",
        "price": 45.50,
        "stock": 120,
        "category": "Technology",
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-1449373320"
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "description": "The phenomenal New York Times Bestseller by Nobel Prize-winner Daniel Kahneman.",
        "price": 18.00,
        "stock": 200,
        "category": "Psychology",
        "image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0374533557"
    },
    {
        "title": "Dune",
        "author": "Frank Herbert",
        "description": "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
        "price": 22.99,
        "stock": 0,
        "category": "Science Fiction",
        "image_url": "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0441172719"
    },
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "description": "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
        "price": 16.99,
        "stock": 85,
        "category": "Self-Help",
        "image_url": "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0735211292"
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "description": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
        "price": 38.00,
        "stock": 42,
        "category": "Technology",
        "image_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0132350884"
    },
    {
        "title": "The Pragmatic Programmer",
        "author": "David Thomas, Andrew Hunt",
        "description": "The Pragmatic Programmer is one of those rare tech books you'll read, re-read, and read again over the years.",
        "price": 42.50,
        "stock": 15,
        "category": "Technology",
        "image_url": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0135957059"
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
        "price": 14.99,
        "stock": 300,
        "category": "Fiction",
        "image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400&h=600",
        "isbn": "978-0451524935"
    }
]

async def seed_database(db):
    try:
        count = await db.books.count_documents({})
        if count == 0:
            logger.info("Database is empty. Seeding initial book data...")
            now = datetime.now(timezone.utc).isoformat()
            
            for book in MOCK_BOOKS:
                book["created_at"] = now
                book["updated_at"] = now
            
            await db.books.insert_many(MOCK_BOOKS)
            logger.info(f"Successfully seeded {len(MOCK_BOOKS)} books.")
        else:
            logger.info(f"Database already contains {count} books. Skipping seeding.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
