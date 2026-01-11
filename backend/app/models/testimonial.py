"""
Testimonial Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    """Base schema for testimonial."""
    name: str = Field(..., min_length=2, max_length=255)
    role: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    testimonial: str = Field(..., min_length=10)
    trek_name: Optional[str] = None
    rating: float = Field(..., ge=1, le=5)
    verified: bool = False
    tags: Optional[List[str]] = None
    helpful_count: int = Field(default=0, ge=0)
    date: str
    featured: bool = False


class TestimonialCreate(TestimonialBase):
    """Schema for creating a testimonial."""
    pass


class TestimonialUpdate(BaseModel):
    """Schema for updating a testimonial."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    role: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    testimonial: Optional[str] = Field(None, min_length=10)
    trek_name: Optional[str] = None
    rating: Optional[float] = Field(None, ge=1, le=5)
    verified: Optional[bool] = None
    tags: Optional[List[str]] = None
    helpful_count: Optional[int] = Field(None, ge=0)
    date: Optional[str] = None
    featured: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    """Schema for testimonial response."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TestimonialListResponse(BaseModel):
    """Schema for testimonial list."""
    id: int
    name: str
    role: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    testimonial: str
    trek_name: Optional[str] = None
    rating: float
    verified: bool
    tags: Optional[List[str]] = None
    date: str
    featured: bool

    class Config:
        from_attributes = True

