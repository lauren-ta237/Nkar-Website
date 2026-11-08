from datetime import date
from sqlalchemy import Date, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import SimpleStatus

class Publication(Base, TimestampMixin):
    __tablename__ = "publications"
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    document_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    file_type: Mapped[str | None] = mapped_column(String(20))
    author_name: Mapped[str | None] = mapped_column(String(200))
    publication_date: Mapped[date | None] = mapped_column(Date)
    status: Mapped[SimpleStatus] = mapped_column(Enum(SimpleStatus, name="publication_simple_status"), default=SimpleStatus.DRAFT, nullable=False)
