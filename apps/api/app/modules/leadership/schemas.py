from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus


class LeadershipCreate(ModuleModel):
    name: str = Field(min_length=2, max_length=200)
    title_role: str = Field(min_length=2, max_length=100)
    bio: str | None = None
    period_active: str | None = Field(default=None, max_length=100)
    photo_url: HttpUrlStr | None = None
    order_index: int = Field(default=0, ge=0)
    status: ContentStatus = ContentStatus.DRAFT


class LeadershipUpdate(ModuleModel):
    name: str | None = Field(default=None, min_length=2, max_length=200)
    title_role: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = None
    period_active: str | None = Field(default=None, max_length=100)
    photo_url: HttpUrlStr | None = None
    order_index: int | None = Field(default=None, ge=0)
    status: ContentStatus | None = None


class LeadershipResponse(LeadershipCreate, Metadata):
    pass
