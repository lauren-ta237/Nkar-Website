from enum import StrEnum


class UserRole(StrEnum):
    SUPER_ADMIN = "super_admin"
    CONTENT_EDITOR = "content_editor"
    CONTENT_REVIEWER = "content_reviewer"


class UserStatus(StrEnum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


class PublicationStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class SimpleStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class NewsCategory(StrEnum):
    ANNOUNCEMENTS = "announcements"
    CLAN_NEWS = "clan_news"
    OBITUARIES = "obituaries"
    CELEBRATIONS = "celebrations"
    EDUCATION = "education"
    HEALTH = "health"
    CULTURE = "culture"


class HeritageCategory(StrEnum):
    HISTORY = "history"
    CUSTOMS = "customs"
    LANGUAGE = "language"
    ROYAL_LINEAGE = "royal_lineage"
    ARTIFACTS = "artifacts"


class MediaType(StrEnum):
    IMAGE = "image"
    VIDEO = "video"


class ProjectStatus(StrEnum):
    PROPOSED = "proposed"
    ONGOING = "ongoing"
    COMPLETED = "completed"


class ContactStatus(StrEnum):
    UNREAD = "unread"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
