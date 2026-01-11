"""
Booking Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class BookingBase(BaseModel):
    """Base schema for booking."""
    trek_id: int
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    group_size: int = Field(..., gt=0, le=50)
    preferred_date: str
    special_requirements: Optional[str] = None


class BookingCreate(BookingBase):
    """Schema for creating a booking."""
    pass


class BookingUpdate(BaseModel):
    """Schema for updating a booking."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    group_size: Optional[int] = Field(None, gt=0, le=50)
    preferred_date: Optional[str] = None
    special_requirements: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|cancelled)$")


class BookingResponse(BookingBase):
    """Schema for booking response."""
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    """Schema for booking list."""
    id: int
    trek_id: int
    name: str
    email: str
    phone: str
    group_size: int
    preferred_date: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

