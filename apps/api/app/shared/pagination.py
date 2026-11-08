from pydantic import BaseModel, Field


class PageParams(BaseModel):
    q: str | None = Field(default=None, max_length=100)
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)
    sort_by: str = Field(default="created_date", pattern=r"^[a-z_]+$")
