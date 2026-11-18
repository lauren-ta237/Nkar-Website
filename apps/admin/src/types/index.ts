// types/index.ts
//
// TypeScript schemas strictly mirroring FastAPI Pydantic models:
// apps/api/app/modules/*/schemas.py and apps/api/app/modules/base.py

export type Role = 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'CONTENT_REVIEWER';
export type UserRole = Role;
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type ContentStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT';
export type ProjectStatus = 'PROPOSED' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
export type ContactStatus = 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
export type HeritageCategory = 'VILLAGE_HISTORY' | 'CUSTOMS' | 'LANGUAGE' | 'ROYAL_LINEAGE' | 'HISTORICAL_ARTIFACTS';
export type NewsCategory = 'GENERAL' | 'CULTURE' | 'DEVELOPMENT' | 'ROYAL_PALACE' | 'EDUCATION' | 'HEALTH';
export type PublicationFileType = 'PDF' | 'DOCX' | 'EPUB' | string;

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'SUSPEND'
  | 'ACTIVATE'
  | 'APPROVE'
  | 'REJECT'
  | 'ARCHIVE'
  | string;

export type EntityType =
  | 'Users'
  | 'News'
  | 'Events'
  | 'Heritage'
  | 'Leadership'
  | 'Gallery'
  | 'Publications'
  | 'DevelopmentProjects'
  | 'ContactSubmissions'
  | string;

export interface Metadata {
  id: string;
  created_at: string;
  updated_at: string;
  created_by_id?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    total_items?: number;
    page?: number;
    page_size?: number;
    skip?: number;
    limit?: number;
  };
}

// User (users/schemas.py -> UserResponse)
export interface User extends Metadata {
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar_url?: string | null;
}

// News (news/schemas.py -> NewsResponse)
export interface News extends Metadata {
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  cover_image: string | null;
  category: NewsCategory | string;
  tags: string[];
  status: ContentStatus;
  is_featured: boolean;
  author_id?: string | null;
  reviewer_id?: string | null;
  review_notes?: string | null;
  published_at?: string | null;
  views: number;
}

// Event (events/schemas.py -> EventResponse)
export interface EventItem extends Metadata {
  title: string;
  slug: string;
  location: string;
  start_datetime: string;
  end_datetime?: string | null;
  content: string;
  cover_image?: string | null;
  media: string[];
  organizer_name?: string | null;
  status: ContentStatus;
  is_featured: boolean;
}

// Heritage (heritage/schemas.py -> HeritageResponse)
export interface Heritage extends Metadata {
  title: string;
  slug: string;
  content: string;
  category: HeritageCategory;
  images: string[];
  status: ContentStatus;
  is_featured: boolean;
  author_id?: string | null;
  reviewed_by_id?: string | null;
}

// Leadership (leadership/schemas.py -> LeadershipResponse)
export interface Leadership extends Metadata {
  name: string;
  traditional_title: string;
  biography?: string | null;
  historical_notes?: string | null;
  portrait_url?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  period_label?: string | null;
  order_index: number;
  status: ContentStatus;
}

// Gallery (gallery/schemas.py -> GalleryResponse)
export interface Gallery extends Metadata {
  title: string;
  alt_text?: string | null;
  description?: string | null;
  media_type: MediaType;
  media_url: string;
  thumbnail_url?: string | null;
  category: string;
  tags: string[];
  status: ContentStatus;
  uploaded_by_id?: string | null;
}

// Publication (publications/schemas.py -> PublicationResponse)
export interface Publication extends Metadata {
  title: string;
  author_name: string;
  description?: string | null;
  cover_image_url?: string | null;
  document_url: string;
  file_type: string;
  file_size_bytes?: number | null;
  publication_year?: number | null;
  status: ContentStatus;
  uploaded_by_id?: string | null;
}

// DevelopmentProject (projects/schemas.py -> DevelopmentProjectResponse)
export interface DevelopmentProject extends Metadata {
  title: string;
  description: string;
  location: string;
  status: ProjectStatus;
  budget_cfa?: number | null;
  progress_percentage: number;
  cover_image_url?: string | null;
  start_date?: string | null;
  completion_date?: string | null;
  milestones?: Record<string, unknown>[] | null;
}

// ContactSubmission (contacts/schemas.py -> ContactSubmissionResponse)
export interface ContactSubmission extends Metadata {
  sender_name: string;
  sender_email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  assigned_to_id?: string | null;
  internal_notes?: string | null;
}

// AuditLog (audit/schemas.py -> AuditLogResponse)
export interface AuditLog {
  id: string;
  actor_id?: string | null;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  severity: string;
  details?: string | null;
  changes?: Record<string, unknown> | null;
  metadata_json?: Record<string, unknown> | null;
  created_at: string;
}

// Dashboard statistics aggregate
export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  upcomingEvents: number;
  heritageRecords: number;
  galleryItems: number;
  publicationsCount: number;
  developmentProjectsCount: number;
  pendingReviews?: number;
  unreadMessages?: number;
  registeredAdmins?: number;
}
