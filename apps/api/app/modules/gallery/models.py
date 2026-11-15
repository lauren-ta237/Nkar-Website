from sqlalchemy import ARRAY, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus, MediaType


class Gallery(Base, TimestampMixin):
    __tablename__ = "gallery"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    alt_text: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType, name="media_type"), default=MediaType.IMAGE, nullable=False)
    media_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(2048))
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    uploaded_by_id: Mapped[PGUUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
