"""
Email logs API - for admin to monitor sent emails and open status.
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.deps import get_db
from app.core.config import settings
from app.db.models.email_log import EmailLog
from app.models.email_log import EmailLogResponse
from app.models.common import PaginatedResponse

router = APIRouter()


@router.get("", response_model=PaginatedResponse[EmailLogResponse])
def list_email_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(None),
    email_type: Optional[str] = Query(None, pattern="^(lead_notification|itinerary|contact_notification)$"),
    status: Optional[str] = Query(None, pattern="^(sent|delivered|opened|bounced|error)$"),
    db: Session = Depends(get_db),
):
    """Get email logs with optional filters."""
    if limit is None:
        limit = settings.DEFAULT_PAGE_SIZE
    limit = min(limit, settings.MAX_PAGE_SIZE)

    query = db.query(EmailLog)
    if email_type:
        query = query.filter(EmailLog.email_type == email_type)
    if status:
        query = query.filter(EmailLog.status == status)

    total = query.count()
    logs = query.order_by(EmailLog.sent_at.desc()).offset(skip).limit(limit).all()

    return PaginatedResponse(
        items=[EmailLogResponse.model_validate(l) for l in logs],
        total=total,
        skip=skip,
        limit=limit,
    )
