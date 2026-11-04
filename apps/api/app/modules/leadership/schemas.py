from pydantic import AnyHttpUrl, Field
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import SimpleStatus

class LeadershipCreate(ModuleModel):
    name: str = Field(min_length=2, max_length=200)
    title_role: str = Field(min_length=2, max_length=100)
    bio: str | None = None
    period_active: str | None = None
    photo_url: AnyHttpUrl | None = None
    order_index: int = Field(default=0, ge=0)
    status: SimpleStatus = SimpleStatus.DRAFT

class LeadershipResponse(LeadershipCreate, Metadata):
    pass
