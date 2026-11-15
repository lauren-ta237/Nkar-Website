from sqlalchemy import ARRAY, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus, MediaType


class Gallery(Base, TimestampMixin):
    __tablename__ = "gallery"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType, name="media_type"), default=MediaType.IMAGE, nullable=False)
    media_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    album_category: Mapped[str | None] = mapped_column(String(200))
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
