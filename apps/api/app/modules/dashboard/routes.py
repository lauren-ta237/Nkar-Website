"""Admin Dashboard and Aggregation Endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.dashboard.schemas import (
    DashboardStatsResponse,
    GlobalSearchResultItem,
    PendingReviewItem,
)
from app.modules.dashboard.service import (
    get_dashboard_stats,
    get_pending_reviews,
    search_admin_portal,
)
from app.shared.responses import Envelope

router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])


@router.get("/stats", response_model=Envelope[DashboardStatsResponse])
async def admin_dashboard_stats(
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Returns SQL-aggregated metrics for the administrative dashboard."""
    stats = await get_dashboard_stats(db)
    return {"success": True, "data": stats}


@router.get("/pending-reviews", response_model=Envelope[list[PendingReviewItem]])
async def admin_pending_reviews(
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Returns submitted items awaiting editorial review across News, Events, and Heritage."""
    items = await get_pending_reviews(db, limit=limit)
    return {"success": True, "data": items}


@router.get("/search", response_model=Envelope[list[GlobalSearchResultItem]])
async def admin_global_search(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(15, ge=1, le=50),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Performs server-side search across admin modules with limit."""
    results = await search_admin_portal(db, q=q, limit=limit)
    return {"success": True, "data": results}
