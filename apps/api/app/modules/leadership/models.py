from sqlalchemy import Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.shared.enums import ContentStatus


class Leadership(Base, TimestampMixin):
    __tablename__ = "leadership"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    traditional_title: Mapped[str] = mapped_column(String(100), nullable=False)
    biography: Mapped[str | None] = mapped_column(Text)
    historical_notes: Mapped[str | None] = mapped_column(Text)
    portrait_url: Mapped[str | None] = mapped_column(String(2048))
    start_year: Mapped[int | None] = mapped_column(Integer)
    end_year: Mapped[int | None] = mapped_column(Integer)
    period_label: Mapped[str | None] = mapped_column(String(100))
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[ContentStatus] = mapped_column(
        Enum(ContentStatus, name="content_status"),
        default=ContentStatus.DRAFT,
        nullable=False,
    )
