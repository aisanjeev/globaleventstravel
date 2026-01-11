"""
Testimonial API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.testimonial import testimonial_crud
from app.models.testimonial import (
    TestimonialCreate, TestimonialUpdate, 
    TestimonialResponse, TestimonialListResponse
)
from app.models.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[TestimonialListResponse])
def list_testimonials(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    featured: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    """Get list of testimonials with optional featured filter."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    filters = {}
    if featured is not None:
        filters["featured"] = featured
    
    testimonials = testimonial_crud.get_multi(db, skip=skip, limit=limit, filters=filters)
    total = testimonial_crud.get_count(db, filters=filters)
    
    return PaginatedResponse(
        items=[TestimonialListResponse.model_validate(t) for t in testimonials],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/featured", response_model=List[TestimonialListResponse])
def list_featured_testimonials(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Get featured testimonials."""
    testimonials = testimonial_crud.get_featured(db, limit=limit)
    return [TestimonialListResponse.model_validate(t) for t in testimonials]


@router.get("/trek/{trek_name}", response_model=List[TestimonialListResponse])
def list_testimonials_by_trek(
    trek_name: str,
    db: Session = Depends(get_db),
):
    """Get testimonials for a specific trek."""
    testimonials = testimonial_crud.get_by_trek(db, trek_name)
    return [TestimonialListResponse.model_validate(t) for t in testimonials]


@router.get("/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    """Get a testimonial by ID."""
    testimonial = testimonial_crud.get(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return TestimonialResponse.model_validate(testimonial)


@router.post("", response_model=TestimonialResponse, status_code=201)
def create_testimonial(
    testimonial_in: TestimonialCreate,
    db: Session = Depends(get_db),
):
    """Create a new testimonial."""
    testimonial = testimonial_crud.create(db, obj_in=testimonial_in)
    return TestimonialResponse.model_validate(testimonial)


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: int,
    testimonial_in: TestimonialUpdate,
    db: Session = Depends(get_db),
):
    """Update a testimonial."""
    testimonial = testimonial_crud.get(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    testimonial = testimonial_crud.update(db, db_obj=testimonial, obj_in=testimonial_in)
    return TestimonialResponse.model_validate(testimonial)


@router.post("/{testimonial_id}/helpful", response_model=TestimonialResponse)
def mark_helpful(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    """Increment the helpful count for a testimonial."""
    testimonial = testimonial_crud.increment_helpful(db, testimonial_id=testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return TestimonialResponse.model_validate(testimonial)


@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    """Delete a testimonial."""
    testimonial = testimonial_crud.get(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    testimonial_crud.remove(db, id=testimonial_id)
    return {"message": "Testimonial deleted successfully"}

