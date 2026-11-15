from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    created_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_by_id: Mapped[UUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))


# Import models after Base exists so Alembic metadata and ENTITY_MODELS share one source of truth.
from app.modules.audit.models import AuditLog  # noqa: E402
from app.modules.contacts.models import ContactSubmission  # noqa: E402
from app.modules.events.models import Event  # noqa: E402
from app.modules.gallery.models import Gallery  # noqa: E402
from app.modules.heritage.models import Heritage  # noqa: E402
from app.modules.leadership.models import Leadership  # noqa: E402
from app.modules.news.models import News  # noqa: E402
from app.modules.projects.models import DevelopmentProject  # noqa: E402
from app.modules.publications.models import Publication  # noqa: E402
from app.modules.users.models import User  # noqa: E402

ENTITY_MODELS: dict[str, type[Base]] = {
    "users": User,
    "news": News,
    "events": Event,
    "heritage": Heritage,
    "leadership": Leadership,
    "gallery": Gallery,
    "publications": Publication,
    "projects": DevelopmentProject,
    "contacts": ContactSubmission,
    "audit_logs": AuditLog,
}

__all__ = [
    "Any",
    "AuditLog",
    "Base",
    "ContactSubmission",
    "DevelopmentProject",
    "ENTITY_MODELS",
    "Event",
    "Gallery",
    "Heritage",
    "Leadership",
    "News",
    "Publication",
    "TimestampMixin",
    "User",
]
