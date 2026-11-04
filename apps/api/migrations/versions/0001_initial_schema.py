"""Create Nkar Woo Lan entity schema.

Revision ID: 0001_initial_schema
"""
from alembic import op
from app.database.base import Base
import app.database.base  # noqa: F401

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
