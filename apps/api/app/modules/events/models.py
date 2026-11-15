from datetime import date

from sqlalchemy import Boolean, Date, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus


class Event(Base, TimestampMixin):
    __tablename__ = "events"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[str | None] = mapped_column(String(5))
    end_time: Mapped[str | None] = mapped_column(String(5))
    cover_image: Mapped[str | None] = mapped_column(String(2048))
    organizer_name: Mapped[str | None] = mapped_column(String(200))
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
