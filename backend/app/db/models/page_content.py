"""
Page content model for CMS-like editable sections.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class PageSection(Base):
    """
    Configurable content section for a given page/key.

    Examples:
    - page = "home", key = "hero"
    - page = "home", key = "why_us"
    - page = "expeditions", key = "safety"
    """

    __tablename__ = "page_sections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Logical grouping
    page: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    key: Mapped[str] = mapped_column(String(100), index=True, nullable=False)

    # Main content fields
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    subtitle: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    badge_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Rich body content (HTML/Markdown rendered on frontend)
    body_html: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Media / CTA
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    cta_label: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    cta_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Ordering & visibility
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

