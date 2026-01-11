"""
Trek Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ============================================
# Itinerary Day Schemas
# ============================================

class ItineraryDayBase(BaseModel):
    """Base schema for itinerary day."""
    day: int
    title: str
    description: str
    elevation_gain: int = 0
    distance: float = 0.0


class ItineraryDayCreate(ItineraryDayBase):
    """Schema for creating an itinerary day."""
    pass


class ItineraryDayResponse(ItineraryDayBase):
    """Schema for itinerary day response."""
    id: int
    trek_id: int

    class Config:
        from_attributes = True


# ============================================
# Trek Image Schemas
# ============================================

class TrekImageBase(BaseModel):
    """Base schema for trek image."""
    url: str
    caption: Optional[str] = None
    display_order: int = 0


class TrekImageCreate(TrekImageBase):
    """Schema for creating a trek image."""
    pass


class TrekImageResponse(TrekImageBase):
    """Schema for trek image response."""
    id: int
    trek_id: int

    class Config:
        from_attributes = True


# ============================================
# Trek Schemas
# ============================================

class TrekBase(BaseModel):
    """Base schema for trek."""
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=255)
    difficulty: str = Field(..., pattern="^(easy|moderate|hard|expert)$")
    duration: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    season: List[str]
    elevation: int = Field(..., gt=0)
    distance: float = Field(..., gt=0)
    description: str
    short_description: Optional[str] = None
    image: str
    rating: float = Field(default=0.0, ge=0, le=5)
    review_count: int = Field(default=0, ge=0)
    featured: bool = False


class TrekCreate(TrekBase):
    """Schema for creating a trek."""
    guide_id: Optional[int] = None
    itinerary: Optional[List[ItineraryDayCreate]] = None
    images: Optional[List[TrekImageCreate]] = None


class TrekUpdate(BaseModel):
    """Schema for updating a trek."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255)
    difficulty: Optional[str] = Field(None, pattern="^(easy|moderate|hard|expert)$")
    duration: Optional[int] = Field(None, gt=0)
    price: Optional[float] = Field(None, gt=0)
    season: Optional[List[str]] = None
    elevation: Optional[int] = Field(None, gt=0)
    distance: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    short_description: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: Optional[int] = Field(None, ge=0)
    featured: Optional[bool] = None
    guide_id: Optional[int] = None


class TrekResponse(TrekBase):
    """Schema for trek response."""
    id: int
    guide_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TrekDetailResponse(TrekResponse):
    """Schema for detailed trek response with relationships."""
    itinerary: List[ItineraryDayResponse] = []
    images: List[TrekImageResponse] = []

    class Config:
        from_attributes = True


class TrekListResponse(BaseModel):
    """Schema for trek list (simplified)."""
    id: int
    name: str
    slug: str
    difficulty: str
    duration: int
    price: float
    season: List[str]
    elevation: int
    distance: float
    short_description: Optional[str] = None
    image: str
    rating: float
    review_count: int
    featured: bool

    class Config:
        from_attributes = True

