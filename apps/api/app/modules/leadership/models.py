from sqlalchemy import Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import SimpleStatus

class Leadership(Base, TimestampMixin):
    __tablename__ = "leadership"
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    title_role: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text)
    period_active: Mapped[str | None] = mapped_column(String(100))
    photo_url: Mapped[str | None] = mapped_column(String(2048))
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[SimpleStatus] = mapped_column(Enum(SimpleStatus, name="leadership_status"), default=SimpleStatus.DRAFT, nullable=False)
