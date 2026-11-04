import re
from datetime import date
from pydantic import AnyHttpUrl

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_slug(value: str) -> str:
    if not SLUG_PATTERN.fullmatch(value):
        raise ValueError("slug must contain lowercase letters, numbers, and hyphens only")
    return value


def validate_date_order(start: date | None, end: date | None) -> None:
    if start and end and end < start:
        raise ValueError("end date must be on or after start date")


def validate_public_url(value: AnyHttpUrl | None) -> AnyHttpUrl | None:
    return value
