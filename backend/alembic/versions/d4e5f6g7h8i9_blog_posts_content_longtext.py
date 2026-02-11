"""Extend blog_posts.content to LONGTEXT for WordPress import

Revision ID: d4e5f6g7h8i9
Revises: c3d4e5f6g7h8
Create Date: 2026-01-24

MySQL TEXT is 64KB; some WP posts exceed this. LONGTEXT supports up to 4GB.
"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy.dialects import mysql


revision: str = "d4e5f6g7h8i9"
down_revision: Union[str, None] = "c3d4e5f6g7h8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "blog_posts",
        "content",
        existing_type=mysql.TEXT(),
        type_=mysql.LONGTEXT(),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "blog_posts",
        "content",
        existing_type=mysql.LONGTEXT(),
        type_=mysql.TEXT(),
        existing_nullable=False,
    )
