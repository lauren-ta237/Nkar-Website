from datetime import datetime

from pydantic import Field, model_validator

from app.modules.base import ContentBase, HttpUrlStr, Metadata, ModuleModel, ModuleRequestModel
from app.shared.enums import EventStatus


class EventCreate(ContentBase):
    location: str = Field(min_length=1, max_length=255)
    start_datetime: datetime
    end_datetime: datetime | None = None
    content: str = Field(min_length=1)
    cover_image: HttpUrlStr | None = None
    media: list[HttpUrlStr] = Field(default_factory=list)
    organizer_name: str | None = Field(default=None, max_length=200)
    status: EventStatus = EventStatus.DRAFT

    @model_validator(mode="after")
    def validate_datetimes(self):
        if self.start_datetime and self.end_datetime and self.end_datetime <= self.start_datetime:
            raise ValueError("end_datetime must be strictly later than start_datetime")
        return self


class EventUpdate(ModuleRequestModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    location: str | None = Field(default=None, min_length=1, max_length=255)
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    content: str | None = Field(default=None, min_length=1)
    cover_image: HttpUrlStr | None = None
    media: list[HttpUrlStr] | None = None
    organizer_name: str | None = Field(default=None, max_length=200)
    status: EventStatus | None = None
    is_featured: bool | None = None

    @model_validator(mode="after")
    def validate_datetimes(self):
        if self.start_datetime and self.end_datetime and self.end_datetime <= self.start_datetime:
            raise ValueError("end_datetime must be strictly later than start_datetime")
        return self


class EventResponse(EventCreate, Metadata):
    pass
