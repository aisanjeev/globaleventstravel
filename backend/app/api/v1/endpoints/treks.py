"""
Trek API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.trek import trek_crud
from app.models.trek import (
    TrekCreate, TrekUpdate, TrekResponse, TrekDetailResponse, TrekListResponse
)
from app.models.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[TrekListResponse])
def list_treks(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    difficulty: Optional[str] = Query(None, pattern="^(easy|moderate|difficult|challenging|extreme)$"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    featured: Optional[bool] = None,
    status: Optional[str] = Query(None, pattern="^(draft|published|archived|seasonal)$"),
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get list of treks with optional filters.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **difficulty**: Filter by difficulty (easy, moderate, difficult, challenging, extreme)
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **featured**: Filter featured treks only
    - **status**: Filter by status (draft, published, archived, seasonal)
    - **location**: Filter by location (partial match)
    - **search**: Search in name, short_description, location
    """
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    treks = trek_crud.get_multi_with_filters(
        db,
        skip=skip,
        limit=limit,
        difficulty=difficulty,
        min_price=min_price,
        max_price=max_price,
        featured=featured,
        status=status,
        location=location,
        search=search,
    )
    total = trek_crud.get_count_with_filters(
        db,
        difficulty=difficulty,
        min_price=min_price,
        max_price=max_price,
        featured=featured,
        status=status,
        location=location,
        search=search,
    )
    
    return PaginatedResponse(
        items=[TrekListResponse.model_validate(t) for t in treks],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/featured", response_model=List[TrekListResponse])
def list_featured_treks(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Get featured treks."""
    treks = trek_crud.get_multi_with_filters(db, limit=limit, featured=True, status="published")
    return [TrekListResponse.model_validate(t) for t in treks]


@router.get("/{slug}", response_model=TrekDetailResponse)
def get_trek(
    slug: str,
    db: Session = Depends(get_db),
):
    """Get a trek by slug with full details."""
    trek = trek_crud.get_by_slug_with_details(db, slug)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    return TrekDetailResponse.model_validate(trek)


@router.get("/id/{trek_id}", response_model=TrekDetailResponse)
def get_trek_by_id(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Get a trek by ID with full details."""
    trek = trek_crud.get_with_details(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    return TrekDetailResponse.model_validate(trek)


@router.post("", response_model=TrekResponse, status_code=201)
def create_trek(
    trek_in: TrekCreate,
    db: Session = Depends(get_db),
):
    """Create a new trek."""
    # Check if slug already exists
    existing = trek_crud.get_by_slug(db, trek_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Trek with this slug already exists")
    
    trek = trek_crud.create_with_relations(db, obj_in=trek_in)
    return TrekResponse.model_validate(trek)


@router.put("/{trek_id}", response_model=TrekDetailResponse)
def update_trek(
    trek_id: int,
    trek_in: TrekUpdate,
    db: Session = Depends(get_db),
):
    """Update a trek."""
    trek = trek_crud.get_with_details(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    # Check slug uniqueness if updating slug
    if trek_in.slug and trek_in.slug != trek.slug:
        existing = trek_crud.get_by_slug(db, trek_in.slug)
        if existing:
            raise HTTPException(status_code=400, detail="Trek with this slug already exists")
    
    trek = trek_crud.update_with_relations(db, db_obj=trek, obj_in=trek_in)
    return TrekDetailResponse.model_validate(trek)


@router.delete("/{trek_id}")
def delete_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Delete a trek."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    trek_crud.remove(db, id=trek_id)
    return {"message": "Trek deleted successfully"}


@router.post("/{trek_id}/publish", response_model=TrekResponse)
def publish_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Publish a trek."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    trek = trek_crud.publish(db, db_obj=trek)
    return TrekResponse.model_validate(trek)


@router.post("/{trek_id}/unpublish", response_model=TrekResponse)
def unpublish_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Unpublish a trek (set to draft)."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    trek = trek_crud.unpublish(db, db_obj=trek)
    return TrekResponse.model_validate(trek)


@router.post("/{trek_id}/archive", response_model=TrekResponse)
def archive_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Archive a trek."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    trek = trek_crud.archive(db, db_obj=trek)
    return TrekResponse.model_validate(trek)


@router.post("/{trek_id}/restore", response_model=TrekResponse)
def restore_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Restore an archived trek to draft."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    trek = trek_crud.restore(db, db_obj=trek)
    return TrekResponse.model_validate(trek)


@router.post("/{trek_id}/duplicate", response_model=TrekResponse, status_code=201)
def duplicate_trek(
    trek_id: int,
    db: Session = Depends(get_db),
):
    """Duplicate a trek."""
    trek = trek_crud.get_with_details(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    new_trek = trek_crud.duplicate(db, db_obj=trek)
    return TrekResponse.model_validate(new_trek)
