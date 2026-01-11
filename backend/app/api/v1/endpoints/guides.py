"""
Guide API endpoints.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.guide import guide_crud
from app.models.guide import GuideCreate, GuideUpdate, GuideResponse
from app.models.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[GuideResponse])
def list_guides(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    db: Session = Depends(get_db),
):
    """Get list of guides."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    guides = guide_crud.get_multi(db, skip=skip, limit=limit)
    total = guide_crud.get_count(db)
    
    return PaginatedResponse(
        items=[GuideResponse.model_validate(g) for g in guides],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{guide_id}", response_model=GuideResponse)
def get_guide(
    guide_id: int,
    db: Session = Depends(get_db),
):
    """Get a guide by ID."""
    guide = guide_crud.get(db, guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return GuideResponse.model_validate(guide)


@router.post("", response_model=GuideResponse, status_code=201)
def create_guide(
    guide_in: GuideCreate,
    db: Session = Depends(get_db),
):
    """Create a new guide."""
    guide = guide_crud.create(db, obj_in=guide_in)
    return GuideResponse.model_validate(guide)


@router.put("/{guide_id}", response_model=GuideResponse)
def update_guide(
    guide_id: int,
    guide_in: GuideUpdate,
    db: Session = Depends(get_db),
):
    """Update a guide."""
    guide = guide_crud.get(db, guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    guide = guide_crud.update(db, db_obj=guide, obj_in=guide_in)
    return GuideResponse.model_validate(guide)


@router.delete("/{guide_id}")
def delete_guide(
    guide_id: int,
    db: Session = Depends(get_db),
):
    """Delete a guide."""
    guide = guide_crud.get(db, guide_id)
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    
    guide_crud.remove(db, id=guide_id)
    return {"message": "Guide deleted successfully"}

