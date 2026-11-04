from pydantic import AnyHttpUrl, Field
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import MediaType, SimpleStatus

class GalleryCreate(ModuleModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    media_type: MediaType = MediaType.IMAGE
    media_url: AnyHttpUrl
    album_category: str | None = None
    tags: list[str] = Field(default_factory=list, max_length=50)
    status: SimpleStatus = SimpleStatus.DRAFT

class GalleryResponse(GalleryCreate, Metadata):
    pass
