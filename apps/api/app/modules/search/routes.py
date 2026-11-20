"""Public search API endpoint."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.search.schemas import PublicSearchResultItem
from app.modules.search.service import search_public_portal
from app.shared.responses import Envelope

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=Envelope[list[PublicSearchResultItem]])
async def public_search(
    q: str = Query(..., min_length=1, max_length=100, description="Search keyword"),
    type: str | None = Query(None, description="Optional type filter (e.g. news, event, heritage, project, publication, gallery)"),
    limit: int = Query(20, ge=1, le=50, description="Max search results"),
    db: AsyncSession = Depends(get_db),
):
    """Executes server-side search across all published public modules."""
    results = await search_public_portal(db, q=q, target_type=type, limit=limit)
    return {"success": True, "data": results}
