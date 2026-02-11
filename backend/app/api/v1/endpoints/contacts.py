"""
Contact message API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.config import settings
from app.crud.contact import contact_crud
from app.crud.trek import trek_crud
from app.crud.expedition import expedition_crud
from app.models.contact import (
    ContactMessageCreate, ContactMessageUpdate,
    ContactMessageResponse, ContactMessageListResponse
)
from app.models.common import PaginatedResponse
from app.services.email import send_contact_notification, send_itinerary_to_user

router = APIRouter()


def _run_contact_automation(
    contact_id: int,
    name: str,
    email: str,
    subject: str,
    message: str,
    trek_interest: Optional[str],
):
    """Background task: notify admin and send itinerary if trek_interest set."""
    send_contact_notification(
        name=name,
        email=email,
        subject=subject,
        message=message,
        trek_interest=trek_interest,
        contact_id=contact_id,
    )

    if not trek_interest or trek_interest == "custom":
        return

    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        pdf_url = None
        interest_name = trek_interest

        trek = trek_crud.get_by_slug(db, trek_interest)
        if trek:
            pdf_url = getattr(trek, "itinerary_pdf_url", None)
            interest_name = trek.name
        else:
            expedition = expedition_crud.get_by_slug(db, trek_interest)
            if expedition:
                pdf_url = getattr(expedition, "itinerary_pdf_url", None)
                interest_name = expedition.name

        if settings.BREVO_API_KEY:
            send_itinerary_to_user(
                name=name,
                email=email,
                interest_name=interest_name,
                interest_type="trek" if trek else "expedition",
                pdf_url=pdf_url,
            )
    finally:
        db.close()


@router.get("", response_model=PaginatedResponse[ContactMessageListResponse])
def list_contact_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    status: Optional[str] = Query(None, pattern="^(unread|read|replied|archived)$"),
    db: Session = Depends(get_db),
):
    """Get list of contact messages with optional status filter."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)
    
    filters = {}
    if status:
        filters["status"] = status
    
    messages = contact_crud.get_multi(db, skip=skip, limit=limit, filters=filters)
    total = contact_crud.get_count(db, filters=filters)
    
    return PaginatedResponse(
        items=[ContactMessageListResponse.model_validate(m) for m in messages],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/unread", response_model=List[ContactMessageListResponse])
def list_unread_messages(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get unread messages (most recent first)."""
    messages = contact_crud.get_unread(db, limit=limit)
    return [ContactMessageListResponse.model_validate(m) for m in messages]


@router.get("/{message_id}", response_model=ContactMessageResponse)
def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    """Get a contact message by ID."""
    message = contact_crud.get(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return ContactMessageResponse.model_validate(message)


@router.post("", response_model=ContactMessageResponse, status_code=201)
def create_contact_message(
    message_in: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    Create a new contact message.

    This endpoint is called when a user submits the contact form.
    Automatically: notifies admin, sends itinerary if trek_interest maps to trek/expedition.
    """
    message = contact_crud.create(db, obj_in=message_in)
    resp = ContactMessageResponse.model_validate(message)

    background_tasks.add_task(
        _run_contact_automation,
        contact_id=message.id,
        name=message.name,
        email=message.email,
        subject=message.subject,
        message=message.message,
        trek_interest=message.trek_interest,
    )

    return resp


@router.put("/{message_id}", response_model=ContactMessageResponse)
def update_contact_message(
    message_id: int,
    message_in: ContactMessageUpdate,
    db: Session = Depends(get_db),
):
    """Update a contact message (typically status or admin notes)."""
    message = contact_crud.get(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message = contact_crud.update(db, db_obj=message, obj_in=message_in)
    return ContactMessageResponse.model_validate(message)


@router.patch("/{message_id}/read", response_model=ContactMessageResponse)
def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
):
    """Mark a message as read."""
    message = contact_crud.mark_as_read(db, message_id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return ContactMessageResponse.model_validate(message)


@router.delete("/{message_id}")
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    """Delete a contact message."""
    message = contact_crud.get(db, message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    contact_crud.remove(db, id=message_id)
    return {"message": "Message deleted successfully"}

