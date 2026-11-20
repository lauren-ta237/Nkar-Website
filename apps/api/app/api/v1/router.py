from fastapi import APIRouter

from app.modules.audit.routes import router as audit_router
from app.modules.auth.routes import router as auth_router
from app.modules.contacts.routes import router as contacts_router
from app.modules.dashboard.routes import router as dashboard_router
from app.modules.events.routes import router as events_router
from app.modules.gallery.routes import router as gallery_router
from app.modules.heritage.routes import router as heritage_router
from app.modules.leadership.routes import router as leadership_router
from app.modules.media.routes import router as media_router
from app.modules.news.routes import router as news_router
from app.modules.projects.routes import router as projects_router
from app.modules.publications.routes import router as publications_router
from app.modules.search.routes import router as search_router
from app.modules.users.routes import router as users_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(search_router)
api_router.include_router(users_router)
api_router.include_router(news_router)
api_router.include_router(events_router)
api_router.include_router(heritage_router)
api_router.include_router(leadership_router)
api_router.include_router(gallery_router)
api_router.include_router(publications_router)
api_router.include_router(projects_router)
api_router.include_router(media_router)
api_router.include_router(contacts_router)
api_router.include_router(audit_router)
