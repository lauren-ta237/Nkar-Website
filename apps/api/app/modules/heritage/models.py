from sqlalchemy import ARRAY, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus, HeritageCategory


class Heritage(Base, TimestampMixin):
    __tablename__ = "heritage"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[HeritageCategory] = mapped_column(Enum(HeritageCategory, name="heritage_category"), nullable=False)
    media_urls: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
