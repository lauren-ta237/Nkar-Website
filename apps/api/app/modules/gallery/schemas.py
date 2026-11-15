from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus, MediaType


class GalleryCreate(ModuleModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    media_type: MediaType = MediaType.IMAGE
    media_url: HttpUrlStr
    album_category: str | None = Field(default=None, max_length=200)
    tags: list[str] = Field(default_factory=list, max_length=50)
    status: ContentStatus = ContentStatus.DRAFT


class GalleryUpdate(ModuleModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    media_type: MediaType | None = None
    media_url: HttpUrlStr | None = None
    album_category: str | None = Field(default=None, max_length=200)
    tags: list[str] | None = Field(default=None, max_length=50)
    status: ContentStatus | None = None


class GalleryResponse(GalleryCreate, Metadata):
    pass
