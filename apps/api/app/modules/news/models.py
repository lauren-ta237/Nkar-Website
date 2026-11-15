from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus, NewsCategory


class News(Base, TimestampMixin):
    __tablename__ = "news"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    summary: Mapped[str | None] = mapped_column(String(500))
    body: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str | None] = mapped_column(String(2048))
    category: Mapped[NewsCategory] = mapped_column(Enum(NewsCategory, name="news_category"), nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
    review_notes: Mapped[str | None] = mapped_column(String(1000))
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
