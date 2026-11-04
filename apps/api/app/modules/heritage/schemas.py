from pydantic import AnyHttpUrl
from app.modules.base import ContentBase, Metadata
from app.shared.enums import HeritageCategory, SimpleStatus

class HeritageCreate(ContentBase):
    content: str
    category: HeritageCategory
    media_urls: list[AnyHttpUrl] = []
    status: SimpleStatus = SimpleStatus.DRAFT

class HeritageResponse(HeritageCreate, Metadata):
    pass
