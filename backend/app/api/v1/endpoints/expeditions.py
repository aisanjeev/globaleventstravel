"""
Expedition API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.expedition import expedition_crud
from app.models.expedition import (
    ExpeditionCreate, ExpeditionUpdate, 
    ExpeditionResponse, ExpeditionDetailResponse, ExpeditionListResponse
)
from app.models.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[ExpeditionListResponse])
def list_expeditions(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    difficulty: Optional[str] = Query(None, pattern="^(advanced|expert|extreme)$"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    featured: Optional[bool] = None,
    region: Optional[str] = None,
    status: Optional[str] = Query(None, pattern="^(draft|published|archived)$"),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get list of expeditions with optional filters.
    """
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    expeditions = expedition_crud.get_multi_with_filters(
        db,
        skip=skip,
        limit=limit,
        difficulty=difficulty,
        min_price=min_price,
        max_price=max_price,
        featured=featured,
        region=region,
        status=status,
        search=search,
    )
    total = expedition_crud.get_count_with_filters(
        db,
        difficulty=difficulty,
        min_price=min_price,
        max_price=max_price,
        featured=featured,
        region=region,
        status=status,
        search=search,
    )
    
    return PaginatedResponse(
        items=[ExpeditionListResponse.from_orm_model(e) for e in expeditions],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/featured", response_model=List[ExpeditionListResponse])
def list_featured_expeditions(
    limit: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Get featured expeditions."""
    expeditions = expedition_crud.get_featured(db, limit=limit)
    return [ExpeditionListResponse.from_orm_model(e) for e in expeditions]


@router.get("/{slug}", response_model=ExpeditionResponse)
def get_expedition(
    slug: str,
    db: Session = Depends(get_db),
):
    """Get an expedition by slug with full details."""
    expedition = expedition_crud.get_by_slug_with_details(db, slug)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    return ExpeditionResponse.from_orm_model(expedition)


@router.get("/id/{expedition_id}", response_model=ExpeditionResponse)
def get_expedition_by_id(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Get an expedition by ID with full details."""
    expedition = expedition_crud.get_with_details(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    return ExpeditionResponse.from_orm_model(expedition)


@router.post("", response_model=ExpeditionResponse, status_code=201)
def create_expedition(
    expedition_in: ExpeditionCreate,
    db: Session = Depends(get_db),
):
    """Create a new expedition."""
    existing = expedition_crud.get_by_slug(db, expedition_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Expedition with this slug already exists")
    
    expedition = expedition_crud.create_with_relations(db, obj_in=expedition_in)
    return ExpeditionResponse.from_orm_model(expedition)


@router.put("/{expedition_id}", response_model=ExpeditionResponse)
def update_expedition(
    expedition_id: int,
    expedition_in: ExpeditionUpdate,
    db: Session = Depends(get_db),
):
    """Update an expedition."""
    expedition = expedition_crud.get_with_details(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    # Check slug uniqueness if being updated
    if expedition_in.slug and expedition_in.slug != expedition.slug:
        existing = expedition_crud.get_by_slug(db, expedition_in.slug)
        if existing:
            raise HTTPException(status_code=400, detail="Expedition with this slug already exists")
    
    updated = expedition_crud.update_with_relations(db, db_obj=expedition, obj_in=expedition_in)
    return ExpeditionResponse.from_orm_model(updated)


@router.delete("/{expedition_id}")
def delete_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Delete an expedition."""
    expedition = expedition_crud.get(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    expedition_crud.remove(db, id=expedition_id)
    return {"message": "Expedition deleted successfully"}


@router.post("/{expedition_id}/publish", response_model=ExpeditionResponse)
def publish_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Publish an expedition."""
    expedition = expedition_crud.get(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    if expedition.status not in ["draft", "archived"]:
        raise HTTPException(status_code=400, detail=f"Cannot publish expedition with status '{expedition.status}'")
    
    expedition.status = "published"
    db.commit()
    db.refresh(expedition)
    return ExpeditionResponse.from_orm_model(expedition)


@router.post("/{expedition_id}/unpublish", response_model=ExpeditionResponse)
def unpublish_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Unpublish an expedition (set to draft)."""
    expedition = expedition_crud.get(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    if expedition.status != "published":
        raise HTTPException(status_code=400, detail=f"Cannot unpublish expedition with status '{expedition.status}'")
    
    expedition.status = "draft"
    db.commit()
    db.refresh(expedition)
    return ExpeditionResponse.from_orm_model(expedition)


@router.post("/{expedition_id}/archive", response_model=ExpeditionResponse)
def archive_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Archive an expedition."""
    expedition = expedition_crud.get(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    if expedition.status == "archived":
        raise HTTPException(status_code=400, detail="Expedition is already archived")
    
    expedition.status = "archived"
    db.commit()
    db.refresh(expedition)
    return ExpeditionResponse.from_orm_model(expedition)


@router.post("/{expedition_id}/restore", response_model=ExpeditionResponse)
def restore_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Restore an archived expedition to draft."""
    expedition = expedition_crud.get(db, expedition_id)
    if not expedition:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    if expedition.status != "archived":
        raise HTTPException(status_code=400, detail="Only archived expeditions can be restored")
    
    expedition.status = "draft"
    db.commit()
    db.refresh(expedition)
    return ExpeditionResponse.from_orm_model(expedition)


@router.post("/{expedition_id}/duplicate", response_model=ExpeditionResponse, status_code=201)
def duplicate_expedition(
    expedition_id: int,
    db: Session = Depends(get_db),
):
    """Duplicate an expedition."""
    duplicated = expedition_crud.duplicate(db, expedition_id)
    if not duplicated:
        raise HTTPException(status_code=404, detail="Expedition not found")
    
    return ExpeditionResponse.from_orm_model(duplicated)

