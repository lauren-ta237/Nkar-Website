from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import UserRole, UserStatus

class User(Base, TimestampMixin):
    __tablename__ = "users"
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), default=UserRole.CONTENT_EDITOR, nullable=False)
    status: Mapped[UserStatus] = mapped_column(Enum(UserStatus, name="user_status"), default=UserStatus.ACTIVE, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(2048))
