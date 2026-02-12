"""
Pydantic schemas for Google reviews.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class GoogleReviewResponse(BaseModel):
    """Schema for a single Google review."""

    id: int
    place_id: str
    author_name: str
    rating: int
    text: str
    review_time: Optional[int] = None
    relative_time_description: Optional[str] = None
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True


class GoogleReviewsResponse(BaseModel):
    """Schema for GET /google-reviews response."""

    reviews: list[GoogleReviewResponse]
    place_name: str
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    last_synced_at: Optional[datetime] = None
