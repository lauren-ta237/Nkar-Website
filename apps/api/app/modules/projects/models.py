from datetime import date
from sqlalchemy import Date, Enum, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base, TimestampMixin
from app.shared.enums import ProjectStatus

class DevelopmentProject(Base, TimestampMixin):
    __tablename__ = "development_projects"
    project_name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[ProjectStatus] = mapped_column(Enum(ProjectStatus, name="project_status"), default=ProjectStatus.PROPOSED, nullable=False)
    budget_cfa: Mapped[int | None] = mapped_column(Numeric(14, 0))
    progress_percentage: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cover_image: Mapped[str | None] = mapped_column(String(2048))
    start_date: Mapped[date | None] = mapped_column(Date)
    completion_date: Mapped[date | None] = mapped_column(Date)
