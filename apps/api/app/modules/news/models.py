from datetime import datetime
from sqlalchemy import ARRAY, Boolean, Enum, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import NewsCategory, PublicationStatus

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
    status: Mapped[PublicationStatus] = mapped_column(Enum(PublicationStatus, name="publication_status"), default=PublicationStatus.DRAFT, nullable=False)
    review_notes: Mapped[str | None] = mapped_column(String(1000))
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
