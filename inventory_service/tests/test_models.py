import pytest
from pydantic import ValidationError
from app.models import BookCreate, BookValidationRequest

def test_book_create_validation():
    # Valid data
    book_data = {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "price": 29.99,
        "stock": 10
    }
    book = BookCreate(**book_data)
    assert book.title == "Clean Code"
    assert book.price == 29.99

    # Invalid data (missing required field)
    invalid_data = {
        "title": "Missing Author",
        "price": 19.99
    }
    with pytest.raises(ValidationError):
        BookCreate(**invalid_data)

def test_book_validation_request():
    payload = {
        "items": [
            {"book_id": "book1", "quantity": 2},
            {"book_id": "book2", "quantity": 5}
        ]
    }
    request = BookValidationRequest(**payload)
    assert len(request.items) == 2
    assert request.items[0].book_id == "book1"
    assert request.items[1].quantity == 5
