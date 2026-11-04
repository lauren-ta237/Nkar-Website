from datetime import date
from pydantic import Field, model_validator
from app.modules.base import ContentBase, Metadata
from app.shared.enums import SimpleStatus

class EventCreate(ContentBase):
    description: str = Field(min_length=1)
    location: str = Field(min_length=1, max_length=255)
    event_date: date
    start_time: str | None = Field(default=None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    end_time: str | None = Field(default=None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    cover_image: str | None = None
    organizer_name: str | None = None
    status: SimpleStatus = SimpleStatus.DRAFT

    @model_validator(mode="after")
    def validate_time_range(self):
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValueError("end_time must be later than start_time")
        return self

class EventResponse(EventCreate, Metadata):
    pass
