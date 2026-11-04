from app.modules.audit.models import AuditLog
from app.modules.contacts.models import ContactSubmission
from app.modules.contributions.models import Contribution
from app.modules.events.models import Event
from app.modules.gallery.models import Gallery
from app.modules.heritage.models import Heritage
from app.modules.leadership.models import Leadership
from app.modules.news.models import News
from app.modules.projects.models import DevelopmentProject
from app.modules.publications.models import Publication
from app.modules.users.models import User

ENTITY_MODELS = {
    "users": User,
    "news": News,
    "events": Event,
    "heritage": Heritage,
    "leadership": Leadership,
    "gallery": Gallery,
    "publications": Publication,
    "projects": DevelopmentProject,
    "contacts": ContactSubmission,
    "contributions": Contribution,
    "audit_logs": AuditLog,
}
