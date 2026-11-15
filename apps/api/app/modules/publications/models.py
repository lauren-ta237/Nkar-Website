from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus


class Publication(Base, TimestampMixin):
    __tablename__ = "publications"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    author_name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    cover_image_url: Mapped[str | None] = mapped_column(String(2048))
    document_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    file_type: Mapped[str] = mapped_column(String(20), default="pdf", nullable=False)
    file_size_bytes: Mapped[int | None] = mapped_column(Integer)
    publication_year: Mapped[int | None] = mapped_column(Integer)
    uploaded_by_id: Mapped[PGUUID | None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
