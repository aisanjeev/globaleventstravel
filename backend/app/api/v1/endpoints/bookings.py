"""
Booking API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.booking import booking_crud
from app.crud.trek import trek_crud
from app.models.booking import BookingCreate, BookingUpdate, BookingResponse, BookingListResponse
from app.models.common import PaginatedResponse, MessageResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[BookingListResponse])
def list_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    status: Optional[str] = Query(None, pattern="^(pending|confirmed|cancelled)$"),
    db: Session = Depends(get_db),
):
    """Get list of bookings with optional status filter."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    filters = {}
    if status:
        filters["status"] = status
    
    bookings = booking_crud.get_multi(db, skip=skip, limit=limit, filters=filters)
    total = booking_crud.get_count(db, filters=filters)
    
    return PaginatedResponse(
        items=[BookingListResponse.model_validate(b) for b in bookings],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    """Get a booking by ID."""
    booking = booking_crud.get(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingResponse.model_validate(booking)


@router.post("", response_model=BookingResponse, status_code=201)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new booking.
    
    This endpoint is called when a user submits a booking form on the frontend.
    """
    # Verify trek exists
    trek = trek_crud.get(db, booking_in.trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    booking = booking_crud.create(db, obj_in=booking_in)
    return BookingResponse.model_validate(booking)


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_in: BookingUpdate,
    db: Session = Depends(get_db),
):
    """Update a booking."""
    booking = booking_crud.get(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = booking_crud.update(db, db_obj=booking, obj_in=booking_in)
    return BookingResponse.model_validate(booking)


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status: str = Query(..., pattern="^(pending|confirmed|cancelled)$"),
    db: Session = Depends(get_db),
):
    """Update booking status."""
    booking = booking_crud.update_status(db, booking_id=booking_id, status=status)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingResponse.model_validate(booking)


@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    """Delete a booking."""
    booking = booking_crud.get(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking_crud.remove(db, id=booking_id)
    return {"message": "Booking deleted successfully"}

