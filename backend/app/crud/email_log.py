"""
CRUD operations for EmailLog model.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.crud.base import CRUDBase
from app.db.models.email_log import EmailLog


class CRUDEmailLog(CRUDBase[EmailLog, dict, dict]):
    """CRUD for email logs - create from dict, no update schema."""

    def create_from_send(
        self,
        db: Session,
        *,
        recipient_email: str,
        subject: str,
        email_type: str,
        lead_id: Optional[int] = None,
        contact_id: Optional[int] = None,
        brevo_message_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        status: str = "sent",
    ) -> EmailLog:
        """Create log entry for a sent or failed email."""
        log = EmailLog(
            recipient_email=recipient_email,
            subject=subject,
            email_type=email_type,
            lead_id=lead_id,
            contact_id=contact_id,
            brevo_message_id=brevo_message_id,
            tags=tags,
            sent_at=datetime.utcnow(),
            status=status,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def get_by_brevo_message_id(
        self, db: Session, *, brevo_message_id: str
    ) -> Optional[EmailLog]:
        """Find log by Brevo message ID."""
        return (
            db.query(EmailLog)
            .filter(EmailLog.brevo_message_id == brevo_message_id)
            .first()
        )

    def update_status(
        self,
        db: Session,
        *,
        log_id: int,
        status: str,
        delivered_at: Optional[datetime] = None,
        opened_at: Optional[datetime] = None,
    ) -> Optional[EmailLog]:
        """Update log status from webhook."""
        log = self.get(db, log_id)
        if not log:
            return None
        log.status = status
        if delivered_at:
            log.delivered_at = delivered_at
        if opened_at:
            log.opened_at = opened_at
        db.commit()
        db.refresh(log)
        return log


email_log_crud = CRUDEmailLog(EmailLog)
