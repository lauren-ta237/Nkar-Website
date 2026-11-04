from sqlalchemy import Enum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import SimpleStatus

class Contribution(Base, TimestampMixin):
    __tablename__ = "contributions"
    contributor_name: Mapped[str] = mapped_column(String(150), nullable=False)
    contributor_email: Mapped[str] = mapped_column(String(320), nullable=False)
    amount_cfa: Mapped[int] = mapped_column(Numeric(14, 0), nullable=False)
    purpose: Mapped[str | None] = mapped_column(String(255))
    reference: Mapped[str | None] = mapped_column(String(100), unique=True)
    status: Mapped[SimpleStatus] = mapped_column(Enum(SimpleStatus, name="contribution_status"), default=SimpleStatus.DRAFT, nullable=False)
