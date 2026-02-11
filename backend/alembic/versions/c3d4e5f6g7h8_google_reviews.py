"""Add google_reviews and google_reviews_meta tables

Revision ID: c3d4e5f6g7h8
Revises: b2c3d4e5f6g7
Create Date: 2026-01-24

Adds google_reviews (cached reviews) and google_reviews_meta (place summary).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c3d4e5f6g7h8"
down_revision: Union[str, None] = "b2c3d4e5f6g7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "google_reviews_meta",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("place_id", sa.String(100), nullable=False),
        sa.Column("place_name", sa.String(255), nullable=False),
        sa.Column("rating", sa.Float(), nullable=True),
        sa.Column("user_ratings_total", sa.Integer(), nullable=True),
        sa.Column("last_synced_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_google_reviews_meta_id", "google_reviews_meta", ["id"])
    op.create_index("uq_google_reviews_meta_place_id", "google_reviews_meta", ["place_id"], unique=True)

    op.create_table(
        "google_reviews",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("place_id", sa.String(100), nullable=False),
        sa.Column("author_name", sa.String(255), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("review_time", sa.BigInteger(), nullable=True),
        sa.Column("relative_time_description", sa.String(100), nullable=True),
        sa.Column("profile_photo_url", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_google_reviews_id", "google_reviews", ["id"])
    op.create_index("ix_google_reviews_place_id", "google_reviews", ["place_id"])


def downgrade() -> None:
    op.drop_index("ix_google_reviews_place_id", table_name="google_reviews")
    op.drop_index("ix_google_reviews_id", table_name="google_reviews")
    op.drop_table("google_reviews")
    op.drop_index("uq_google_reviews_meta_place_id", table_name="google_reviews_meta")
    op.drop_index("ix_google_reviews_meta_id", table_name="google_reviews_meta")
    op.drop_table("google_reviews_meta")
