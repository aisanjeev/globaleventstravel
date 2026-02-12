"""Make leads.email nullable for minimal form variant

Revision ID: g5h6i7j8k9l0
Revises: f53efd85673f
Create Date: 2025-01-24

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'g5h6i7j8k9l0'
down_revision = 'd4e5f6g7h8i9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        'leads',
        'email',
        existing_type=sa.String(255),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        'leads',
        'email',
        existing_type=sa.String(255),
        nullable=False,
    )
