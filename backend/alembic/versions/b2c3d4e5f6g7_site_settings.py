"""Add site_settings table

Revision ID: b2c3d4e5f6g7
Revises: f53efd85673f
Create Date: 2026-01-24

Adds site_settings table (single row id=1) for company information.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b2c3d4e5f6g7"
down_revision: Union[str, None] = "f53efd85673f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "site_settings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=False),
        sa.Column("company_name", sa.String(255), nullable=False),
        sa.Column("tagline", sa.String(500), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("url", sa.String(500), nullable=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(50), nullable=False),
        sa.Column("address", sa.String(500), nullable=True),
        sa.Column("facebook_url", sa.String(500), nullable=True),
        sa.Column("instagram_url", sa.String(500), nullable=True),
        sa.Column("twitter_url", sa.String(500), nullable=True),
        sa.Column("youtube_url", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_site_settings_id"), "site_settings", ["id"], unique=False)

    # Idempotent: insert default row if empty (from constants)
    conn = op.get_bind()
    result = conn.execute(sa.text("SELECT COUNT(*) FROM site_settings"))
    if result.scalar() == 0:
        conn.execute(
            sa.text("""
                INSERT INTO site_settings (
                    id, company_name, tagline, description, url, email, phone, address,
                    facebook_url, instagram_url, twitter_url, youtube_url
                ) VALUES (
                    1,
                    'Global Events Travels',
                    'Adventure Awaits in the Himalayas',
                    'Discover amazing treks and expeditions in the Himalayas with experienced guides and unforgettable experiences.',
                    'https://globaleventstravels.com',
                    'info@globaleventstravels.com',
                    '+91 63833 13359',
                    'Manali, Himachal Pradesh, India',
                    'https://www.facebook.com/TheTrekkingCommunity',
                    'https://www.instagram.com/global_events_travels',
                    '#',
                    'https://www.youtube.com/@globaleventstravels6010'
                )
            """)
        )


def downgrade() -> None:
    op.drop_index(op.f("ix_site_settings_id"), table_name="site_settings")
    op.drop_table("site_settings")
