from pydantic import BaseModel, Field
from typing import Optional


class BookCreate(BaseModel):
    title: str
    author: str
    description: str = ""
    price: float
    stock: int = 0
    category: str = ""
    image_url: str = ""
    isbn: str = ""


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    isbn: Optional[str] = None


class BookResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    author: str
    description: str = ""
    price: float
    stock: int
    category: str = ""
    image_url: str = ""
    isbn: str = ""
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True
