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
    difficulty: Optional[str] = Query(None, pattern="^(easy|moderate|hard|expert)$"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    featured: Optional[bool] = None,
    season: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get list of treks with optional filters.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **difficulty**: Filter by difficulty (easy, moderate, hard, expert)
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **featured**: Filter featured treks only
    - **season**: Filter by season month
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
        season=season,
    )
    total = trek_crud.get_count_with_filters(
        db,
        difficulty=difficulty,
        min_price=min_price,
        max_price=max_price,
        featured=featured,
        season=season,
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
    treks = trek_crud.get_featured(db, limit=limit)
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


@router.put("/{trek_id}", response_model=TrekResponse)
def update_trek(
    trek_id: int,
    trek_in: TrekUpdate,
    db: Session = Depends(get_db),
):
    """Update a trek."""
    trek = trek_crud.get(db, trek_id)
    if not trek:
        raise HTTPException(status_code=404, detail="Trek not found")
    
    # Check slug uniqueness if updating slug
    if trek_in.slug and trek_in.slug != trek.slug:
        existing = trek_crud.get_by_slug(db, trek_in.slug)
        if existing:
            raise HTTPException(status_code=400, detail="Trek with this slug already exists")
    
    trek = trek_crud.update(db, db_obj=trek, obj_in=trek_in)
    return TrekResponse.model_validate(trek)


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

