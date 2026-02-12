"""
Webhook endpoints for external services (e.g. Brevo).
"""
from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.crud.email_log import email_log_crud

router = APIRouter()

# Map Brevo event names to our status
EVENT_TO_STATUS = {
    "request": "sent",
    "delivered": "delivered",
    "unique_opened": "opened",
    "opened": "opened",
    "hard_bounce": "bounced",
    "soft_bounce": "bounced",
}


@router.post("/brevo")
async def brevo_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Receive Brevo transactional email webhook events.
    Updates EmailLog with delivered_at, opened_at, status.
    """
    try:
        body = await request.json()
    except Exception:
        return {"status": "ok"}

    event = body.get("event")
    message_id = body.get("message-id") or body.get("messageId")
    if not message_id or not event:
        return {"status": "ok"}

    status = EVENT_TO_STATUS.get(event)
    if not status:
        return {"status": "ok"}

    log = email_log_crud.get_by_brevo_message_id(db, brevo_message_id=message_id)
    if not log:
        return {"status": "ok"}

    ts = body.get("ts_event") or body.get("ts_epoch")
    if ts:
        try:
            dt = datetime.utcfromtimestamp(ts / 1000 if ts > 1e12 else ts)
        except (ValueError, OSError):
            dt = None
    else:
        dt = datetime.utcnow()

    if status == "delivered" and dt:
        email_log_crud.update_status(
            db, log_id=log.id, status="delivered", delivered_at=dt
        )
    elif status == "opened" and dt:
        email_log_crud.update_status(
            db, log_id=log.id, status="opened", opened_at=dt
        )
    elif status == "bounced":
        email_log_crud.update_status(db, log_id=log.id, status="bounced")

    return {"status": "ok"}
