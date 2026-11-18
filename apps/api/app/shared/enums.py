from enum import StrEnum


from enum import StrEnum


class CaseInsensitiveStrEnum(StrEnum):
    @classmethod
    def _missing_(cls, value: object):
        if isinstance(value, str):
            clean_val = value.strip().lower()
            for member in cls:
                if member.value == clean_val or member.name.lower() == clean_val:
                    return member
        return None


class UserRole(CaseInsensitiveStrEnum):
    SUPER_ADMIN = "super_admin"
    CONTENT_EDITOR = "content_editor"
    CONTENT_REVIEWER = "content_reviewer"


class UserStatus(CaseInsensitiveStrEnum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


class ContentStatus(CaseInsensitiveStrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class EventStatus(CaseInsensitiveStrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PUBLISHED = "published"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class NewsCategory(CaseInsensitiveStrEnum):
    ANNOUNCEMENTS = "announcements"
    CLAN_NEWS = "clan_news"
    OBITUARIES = "obituaries"
    CELEBRATIONS = "celebrations"
    EDUCATION = "education"
    HEALTH = "health"
    CULTURE = "culture"


class HeritageCategory(CaseInsensitiveStrEnum):
    HISTORY = "history"
    ORIGINS = "origins"
    CULTURE = "culture"
    TRADITIONS = "traditions"
    CUSTOMS = "customs"
    LANGUAGE = "language"
    ROYAL_LINEAGE = "royal_lineage"
    ARTIFACTS = "artifacts"


class MediaType(CaseInsensitiveStrEnum):
    IMAGE = "image"
    VIDEO = "video"


class ProjectStatus(CaseInsensitiveStrEnum):
    PROPOSED = "proposed"
    ONGOING = "ongoing"
    COMPLETED = "completed"


class ContactStatus(CaseInsensitiveStrEnum):
    UNREAD = "unread"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class AuditSeverity(CaseInsensitiveStrEnum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
