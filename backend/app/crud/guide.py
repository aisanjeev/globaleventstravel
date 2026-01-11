"""
CRUD operations for Guide model.
"""
from app.crud.base import CRUDBase
from app.db.models.guide import Guide
from app.models.guide import GuideCreate, GuideUpdate


class CRUDGuide(CRUDBase[Guide, GuideCreate, GuideUpdate]):
    """CRUD operations for Guide model."""
    pass


guide_crud = CRUDGuide(Guide)

