"""Schemas for the public search endpoint."""

from uuid import UUID
from pydantic import BaseModel, ConfigDict


class PublicSearchResultItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    type: str  # News, Event, Heritage, Leadership, Project, Publication, Gallery
    category: str | None = None
    subtitle: str | None = None
    url: str
