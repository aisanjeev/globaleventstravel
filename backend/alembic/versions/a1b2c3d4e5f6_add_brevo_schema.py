"""Add Brevo email & PDF itinerary schema

Revision ID: a1b2c3d4e5f6
Revises: e8f6412800f4
Create Date: 2026-01-24

Adds:
- interest_type to leads (trek | expedition)
- itinerary_pdf_url to treks and expeditions
- email_logs table for Brevo transactional email tracking
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'e8f6412800f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(conn, table: str, column: str) -> bool:
    insp = inspect(conn)
    cols = [c["name"] for c in insp.get_columns(table)]
    return column in cols


def _table_exists(conn, table: str) -> bool:
    insp = inspect(conn)
    return table in insp.get_table_names()


def upgrade() -> None:
    conn = op.get_bind()

    # Add interest_type to leads
    if not _column_exists(conn, 'leads', 'interest_type'):
        op.add_column('leads', sa.Column('interest_type', sa.String(20), nullable=False, server_default='trek'))

    # Add itinerary_pdf_url to treks
    if not _column_exists(conn, 'treks', 'itinerary_pdf_url'):
        op.add_column('treks', sa.Column('itinerary_pdf_url', sa.String(500), nullable=True))

    # Add itinerary_pdf_url to expeditions
    if not _column_exists(conn, 'expeditions', 'itinerary_pdf_url'):
        op.add_column('expeditions', sa.Column('itinerary_pdf_url', sa.String(500), nullable=True))

    # Create email_logs table
    if not _table_exists(conn, 'email_logs'):
        op.create_table(
            'email_logs',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('recipient_email', sa.String(255), nullable=False),
            sa.Column('subject', sa.String(500), nullable=False),
            sa.Column('email_type', sa.String(50), nullable=False),
            sa.Column('lead_id', sa.Integer(), nullable=True),
            sa.Column('contact_id', sa.Integer(), nullable=True),
            sa.Column('brevo_message_id', sa.String(500), nullable=True),
            sa.Column('tags', sa.JSON(), nullable=True),
            sa.Column('sent_at', sa.DateTime(), nullable=False),
            sa.Column('delivered_at', sa.DateTime(), nullable=True),
            sa.Column('opened_at', sa.DateTime(), nullable=True),
            sa.Column('status', sa.String(30), nullable=False, server_default='sent'),
            sa.PrimaryKeyConstraint('id'),
            sa.ForeignKeyConstraint(['lead_id'], ['leads.id'], ondelete='SET NULL'),
            sa.ForeignKeyConstraint(['contact_id'], ['contact_messages.id'], ondelete='SET NULL'),
        )
        op.create_index('idx_email_logs_recipient', 'email_logs', ['recipient_email'], unique=False)
        op.create_index('idx_email_logs_email_type', 'email_logs', ['email_type'], unique=False)
        op.create_index('idx_email_logs_brevo_message_id', 'email_logs', ['brevo_message_id'], unique=False)


def downgrade() -> None:
    conn = op.get_bind()

    if _table_exists(conn, 'email_logs'):
        op.drop_index('idx_email_logs_brevo_message_id', table_name='email_logs')
        op.drop_index('idx_email_logs_email_type', table_name='email_logs')
        op.drop_index('idx_email_logs_recipient', table_name='email_logs')
        op.drop_table('email_logs')

    if _column_exists(conn, 'expeditions', 'itinerary_pdf_url'):
        op.drop_column('expeditions', 'itinerary_pdf_url')
    if _column_exists(conn, 'treks', 'itinerary_pdf_url'):
        op.drop_column('treks', 'itinerary_pdf_url')
    if _column_exists(conn, 'leads', 'interest_type'):
        op.drop_column('leads', 'interest_type')
