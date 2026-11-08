from typing import Any, Generic, TypeVar
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.base import Base

ModelT = TypeVar("ModelT", bound=Base)

class Repository(Generic[ModelT]):
    def __init__(self, model: type[ModelT]):
        self.model = model

    async def get(self, db: AsyncSession, item_id: UUID) -> ModelT | None:
        return await db.get(self.model, item_id)

    async def list(self, db: AsyncSession, *, skip: int = 0, limit: int = 20):
        total = await db.scalar(select(func.count()).select_from(self.model)) or 0
        rows = (await db.scalars(select(self.model).offset(skip).limit(limit))).all()
        return list(rows), total

    async def create(self, db: AsyncSession, values: dict[str, Any]) -> ModelT:
        row = self.model(**values)
        db.add(row)
        await db.commit()
        await db.refresh(row)
        return row

    async def update(self, db: AsyncSession, row: ModelT, values: dict[str, Any]) -> ModelT:
        for key, value in values.items():
            if key in self.model.__table__.columns:
                setattr(row, key, value)
        await db.commit()
        await db.refresh(row)
        return row

    async def delete(self, db: AsyncSession, row: ModelT) -> None:
        await db.delete(row)
        await db.commit()
