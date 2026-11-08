from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

class ModuleModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

class Metadata(ModuleModel):
    id: UUID
    created_date: datetime
    updated_date: datetime
    created_by_id: UUID | None = None

class ContentBase(ModuleModel):
    title: str = Field(min_length=3, max_length=200)
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    featured: bool = False
