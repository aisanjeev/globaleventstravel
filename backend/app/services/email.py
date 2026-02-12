"""
Brevo transactional email service.
Sends lead notifications and itinerary emails via Brevo API.
"""
import json
import logging
import urllib.request
from datetime import datetime

from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

from app.core.config import settings
from app.email.templates import render_template


BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _brevo_request(payload: Dict[str, Any]) -> Optional[str]:
    """
    Send request to Brevo API.
    Returns message_id on success, None on failure or if API key not configured.
    """
    if not settings.BREVO_API_KEY:
        return None

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        BREVO_API_URL,
        data=data,
        headers={
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            return result.get("messageId")
    except Exception as e:
        err_msg = str(e)
        if "401" in err_msg or "Unauthorized" in err_msg:
            logger.warning(
                "Brevo API 401 Unauthorized: Check BREVO_API_KEY in .env. "
                "Get a valid key at Brevo → Settings → SMTP & API → API Keys."
            )
        else:
            logger.warning("Brevo email send failed: %s", e)
        return None


def send_contact_notification(
    *,
    name: str,
    email: str,
    subject: str,
    message: str,
    trek_interest: Optional[str] = None,
    contact_id: Optional[int] = None,
) -> Optional[str]:
    """
    Send contact form notification to admin.
    Returns message_id if sent, None otherwise.
    """
    if not settings.ADMIN_EMAIL:
        return None

    html_content = render_template(
        "contact_notification.html",
        {
            "name": name,
            "email": email,
            "subject": subject,
            "message": message,
            "trek_interest": trek_interest or "",
        },
    )

    tags = ["contact_notification"]
    if contact_id:
        tags.append(f"contact_{contact_id}")

    payload = {
        "sender": {"name": settings.SENDER_NAME, "email": settings.SENDER_EMAIL},
        "to": [{"email": settings.ADMIN_EMAIL, "name": "Admin"}],
        "subject": f"Contact: {subject}",
        "htmlContent": html_content,
        "tags": tags,
    }

    return _brevo_request(payload)


def send_lead_notification(
    *,
    name: str,
    email: Optional[str] = None,
    whatsapp: str,
    interest_type: str,
    interest_name: str,
    source: str,
    lead_id: Optional[int] = None,
) -> Optional[str]:
    """
    Send new lead notification to admin.
    Returns message_id if sent, None otherwise.
    """
    if not settings.ADMIN_EMAIL:
        return None

    html_content = render_template(
        "lead_notification.html",
        {
            "name": name,
            "email": email or "Not provided",
            "whatsapp": whatsapp,
            "interest_type": interest_type,
            "interest_name": interest_name,
            "source": source,
        },
    )

    tags = ["lead_notification"]
    if lead_id:
        tags.append(f"lead_{lead_id}")

    payload = {
        "sender": {"name": settings.SENDER_NAME, "email": settings.SENDER_EMAIL},
        "to": [{"email": settings.ADMIN_EMAIL, "name": "Admin"}],
        "subject": f"New Lead: {interest_name}",
        "htmlContent": html_content,
        "tags": tags,
    }

    return _brevo_request(payload)


def send_itinerary_to_user(
    *,
    name: str,
    email: str,
    interest_name: str,
    interest_type: str,
    pdf_url: Optional[str] = None,
    lead_id: Optional[int] = None,
) -> Optional[str]:
    """
    Send itinerary email to the lead with PDF link or attachment.
    Returns message_id if sent, None otherwise.
    """
    html_content = render_template(
        "itinerary_to_user.html",
        {
            "name": name,
            "interest_name": interest_name,
            "interest_type": interest_type,
            "pdf_url": pdf_url or "",
        },
    )

    tags = ["itinerary"]
    if lead_id:
        tags.append(f"lead_{lead_id}")

    payload = {
        "sender": {"name": settings.SENDER_NAME, "email": settings.SENDER_EMAIL},
        "to": [{"email": email, "name": name}],
        "subject": f"Your {interest_name} Itinerary",
        "htmlContent": html_content,
        "tags": tags,
    }

    # Attach PDF via URL if available (Brevo supports attachment with url)
    if pdf_url:
        # Ensure absolute URL for Brevo
        abs_url = pdf_url
        if not pdf_url.startswith("http"):
            base = settings.API_BASE_URL.rstrip("/")
            abs_url = f"{base}{pdf_url}" if pdf_url.startswith("/") else f"{base}/{pdf_url}"
        payload["attachment"] = [{"name": "itinerary.pdf", "url": abs_url}]

    return _brevo_request(payload)
