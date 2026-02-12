"""
CRUD operations for PageSection model.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import asc
from app.crud.base import CRUDBase
from app.db.models.page_content import PageSection
from app.models.page_content import PageSectionCreate, PageSectionUpdate


class CRUDPageSection(CRUDBase[PageSection, PageSectionCreate, PageSectionUpdate]):
    """CRUD operations for PageSection model."""

    def get_by_page_and_key(
        self,
        db: Session,
        *,
        page: str,
        key: str,
    ) -> Optional[PageSection]:
        return (
            db.query(PageSection)
            .filter(PageSection.page == page, PageSection.key == key)
            .first()
        )

    def list_by_page(
        self,
        db: Session,
        *,
        page: str,
        active_only: bool = True,
    ) -> List[PageSection]:
        query = db.query(PageSection).filter(PageSection.page == page)
        if active_only:
            query = query.filter(PageSection.is_active.is_(True))
        return query.order_by(asc(PageSection.display_order), asc(PageSection.id)).all()


page_section_crud = CRUDPageSection(PageSection)

