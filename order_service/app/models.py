from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


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


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    captcha_token: str


class UserLogin(BaseModel):
    email: str
    password: str
    captcha_token: str


class UserPublic(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    role: UserRole

    class Config:
        populate_by_name = True


class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    customer_name: str
    customer_email: str
    customer_phone: str = ""
    customer_address: str
    items: List[OrderItem]
    total_amount: float
    status: OrderStatus
    user_id: Optional[str] = None
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True
