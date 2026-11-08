from sqlalchemy import Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import ContactStatus

class ContactSubmission(Base, TimestampMixin):
    __tablename__ = "contact_submissions"
    sender_name: Mapped[str] = mapped_column(String(100), nullable=False)
    sender_email: Mapped[str] = mapped_column(String(320), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30))
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ContactStatus] = mapped_column(Enum(ContactStatus, name="contact_status"), default=ContactStatus.UNREAD, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
