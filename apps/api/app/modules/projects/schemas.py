from datetime import date
from pydantic import AnyHttpUrl, Field, model_validator
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import ProjectStatus

class DevelopmentProjectCreate(ModuleModel):
    project_name: str = Field(min_length=1, max_length=200)
    description: str
    location: str | None = None
    status: ProjectStatus = ProjectStatus.PROPOSED
    budget_cfa: int | None = Field(default=None, gt=0)
    progress_percentage: int = Field(default=0, ge=0, le=100)
    cover_image: AnyHttpUrl | None = None
    start_date: date | None = None
    completion_date: date | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.completion_date and self.completion_date < self.start_date:
            raise ValueError("completion_date must be on or after start_date")
        return self

class DevelopmentProjectResponse(DevelopmentProjectCreate, Metadata):
    pass
