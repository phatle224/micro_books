from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderItem(BaseModel):
    book_id: str
    title: str
    price: float
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str = ""
    customer_address: str
    items: List[OrderItem]


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None


class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    customer_name: str
    customer_email: str
    customer_phone: str = ""
    customer_address: str
    items: List[OrderItem]
    total_amount: float
    status: OrderStatus
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True
