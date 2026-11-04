from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class Envelope(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: dict | None = None


class ErrorBody(BaseModel):
    success: bool = False
    error: dict
