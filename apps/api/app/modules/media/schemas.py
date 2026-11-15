"""Pydantic schemas for media uploads."""

from pydantic import BaseModel


class MediaUploadResponse(BaseModel):
    url: str
    secure_url: str
    public_id: str
    resource_type: str
    format: str | None = None
    bytes: int
    original_filename: str
    folder: str


class MediaDeleteRequest(BaseModel):
    public_id: str
    resource_type: str = "image"
