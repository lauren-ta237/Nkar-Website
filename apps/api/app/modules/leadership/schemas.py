from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel, ModuleRequestModel
from app.shared.enums import ContentStatus


class LeadershipCreate(ModuleRequestModel):
    name: str = Field(min_length=2, max_length=200)
    traditional_title: str = Field(min_length=2, max_length=100)
    biography: str | None = None
    historical_notes: str | None = None
    portrait_url: HttpUrlStr | None = None
    start_year: int | None = None
    end_year: int | None = None
    period_label: str | None = Field(default=None, max_length=100)
    order_index: int = Field(default=0, ge=0)
    status: ContentStatus = ContentStatus.DRAFT


class LeadershipUpdate(ModuleRequestModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    traditional_title: str | None = Field(default=None, min_length=2, max_length=100)
    biography: str | None = None
    historical_notes: str | None = None
    portrait_url: HttpUrlStr | None = None
    start_year: int | None = None
    end_year: int | None = None
    period_label: str | None = Field(default=None, max_length=100)
    order_index: int | None = Field(default=None, ge=0)
    status: ContentStatus | None = None


class LeadershipResponse(LeadershipCreate, Metadata):
    pass
