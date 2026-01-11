"""
Lead API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.lead import lead_crud
from app.crud.trek import trek_crud
from app.models.lead import LeadCreate, LeadUpdate, LeadResponse, LeadListResponse
from app.models.common import PaginatedResponse, MessageResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[LeadListResponse])
def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    status: Optional[str] = Query(None, pattern="^(new|contacted|converted|lost)$"),
    db: Session = Depends(get_db),
):
    """Get list of leads with optional status filter."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    filters = {}
    if status:
        filters["status"] = status
    
    leads = lead_crud.get_multi(db, skip=skip, limit=limit, filters=filters)
    total = lead_crud.get_count(db, filters=filters)
    
    return PaginatedResponse(
        items=[LeadListResponse.model_validate(l) for l in leads],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/new", response_model=List[LeadListResponse])
def list_new_leads(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get new/uncontacted leads (most recent first)."""
    leads = lead_crud.get_new_leads(db, limit=limit)
    return [LeadListResponse.model_validate(l) for l in leads]


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
):
    """Get a lead by ID."""
    lead = lead_crud.get(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse.model_validate(lead)


@router.post("", response_model=LeadResponse, status_code=201)
def create_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new lead.
    
    This endpoint is called when a user submits a lead capture form on the frontend
    (e.g., hero section form, trek page form, mobile sticky form).
    """
    # Try to get trek name if not provided
    if not lead_in.trek_name and lead_in.trek_slug != "custom":
        trek = trek_crud.get_by_slug(db, lead_in.trek_slug)
        if trek:
            lead_in.trek_name = trek.name
    
    lead = lead_crud.create(db, obj_in=lead_in)
    return LeadResponse.model_validate(lead)


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int,
    lead_in: LeadUpdate,
    db: Session = Depends(get_db),
):
    """Update a lead (typically status or notes)."""
    lead = lead_crud.get(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead = lead_crud.update(db, db_obj=lead, obj_in=lead_in)
    return LeadResponse.model_validate(lead)


@router.patch("/{lead_id}/itinerary-sent", response_model=LeadResponse)
def mark_itinerary_sent(
    lead_id: int,
    db: Session = Depends(get_db),
):
    """Mark that itinerary has been sent to the lead."""
    lead = lead_crud.mark_itinerary_sent(db, lead_id=lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse.model_validate(lead)


@router.delete("/{lead_id}")
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
):
    """Delete a lead."""
    lead = lead_crud.get(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead_crud.remove(db, id=lead_id)
    return {"message": "Lead deleted successfully"}

