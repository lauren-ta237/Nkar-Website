from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus, HeritageCategory


class HeritageCreate(ModuleModel):
    title: str = Field(min_length=3, max_length=200)
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    content: str = Field(min_length=1)
    category: HeritageCategory
    media_urls: list[HttpUrlStr] = Field(default_factory=list)
    status: ContentStatus = ContentStatus.DRAFT


class HeritageUpdate(ModuleModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    content: str | None = Field(default=None, min_length=1)
    category: HeritageCategory | None = None
    media_urls: list[HttpUrlStr] | None = None
    status: ContentStatus | None = None


class HeritageResponse(HeritageCreate, Metadata):
    pass
