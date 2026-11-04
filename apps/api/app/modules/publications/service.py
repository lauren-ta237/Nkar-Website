from typing import Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.publications.models import Publication
from app.modules.publications.repository import repository

class PublicationService:
    async def list(self, db: AsyncSession, skip: int = 0, limit: int = 20): return await repository.list(db, skip=skip, limit=limit)
    async def get(self, db: AsyncSession, item_id: UUID): return await repository.get(db, item_id)
    async def create(self, db: AsyncSession, values: dict[str, Any]): return await repository.create(db, values)
    async def update(self, db: AsyncSession, row: Publication, values: dict[str, Any]): return await repository.update(db, row, values)
    async def delete(self, db: AsyncSession, row: Publication): return await repository.delete(db, row)

service = PublicationService()
