"""
Pydantic schemas for TrekBatch.
"""
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class TrekBatchBase(BaseModel):
    start_date: date
    end_date: date
    total_seats: int = Field(default=20, ge=1, le=500)
    booked_seats: int = Field(default=0, ge=0)
    price_override: Optional[float] = Field(default=None, gt=0)
    is_active: bool = True
    notes: Optional[str] = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_dates_and_seats(self):
        if self.end_date <= self.start_date:
            raise ValueError("end_date must be after start_date")
        if self.booked_seats > self.total_seats:
            raise ValueError("booked_seats cannot exceed total_seats")
        return self


class TrekBatchCreate(TrekBatchBase):
    pass


class TrekBatchUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_seats: Optional[int] = Field(default=None, ge=1, le=500)
    booked_seats: Optional[int] = Field(default=None, ge=0)
    price_override: Optional[float] = Field(default=None, gt=0)
    is_active: Optional[bool] = None
    notes: Optional[str] = Field(default=None, max_length=500)


class TrekBatchResponse(TrekBatchBase):
    id: int
    trek_id: int
    available_seats: int
    is_sold_out: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj) -> "TrekBatchResponse":
        available = obj.total_seats - obj.booked_seats
        data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
        data["available_seats"] = available
        data["is_sold_out"] = available <= 0
        return cls(**data)
