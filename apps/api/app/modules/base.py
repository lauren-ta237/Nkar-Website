from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import AnyHttpUrl, BaseModel, BeforeValidator, ConfigDict, Field, TypeAdapter

_http_url_adapter = TypeAdapter(AnyHttpUrl)


def _validate_http_url_str(value: object) -> str:
    if isinstance(value, str):
        value = value.strip()
    validated = _http_url_adapter.validate_python(value)
    return str(validated)


HttpUrlStr = Annotated[str, BeforeValidator(_validate_http_url_str)]


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
