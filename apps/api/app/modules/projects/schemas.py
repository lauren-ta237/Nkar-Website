from datetime import date

from pydantic import Field, model_validator

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ProjectStatus


class DevelopmentProjectCreate(ModuleModel):
    project_name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    location: str | None = Field(default=None, max_length=255)
    status: ProjectStatus = ProjectStatus.PROPOSED
    budget_cfa: int | None = Field(default=None, gt=0)
    progress_percentage: int = Field(default=0, ge=0, le=100)
    cover_image: HttpUrlStr | None = None
    start_date: date | None = None
    completion_date: date | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.completion_date and self.completion_date < self.start_date:
            raise ValueError("completion_date must be on or after start_date")
        return self


class DevelopmentProjectUpdate(ModuleModel):
    project_name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    location: str | None = Field(default=None, max_length=255)
    status: ProjectStatus | None = None
    budget_cfa: int | None = Field(default=None, gt=0)
    progress_percentage: int | None = Field(default=None, ge=0, le=100)
    cover_image: HttpUrlStr | None = None
    start_date: date | None = None
    completion_date: date | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.completion_date and self.completion_date < self.start_date:
            raise ValueError("completion_date must be on or after start_date")
        return self


class DevelopmentProjectResponse(DevelopmentProjectCreate, Metadata):
    pass
