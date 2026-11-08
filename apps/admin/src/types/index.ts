export type Role = 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'CONTENT_REVIEWER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar: string;
  phone?: string;
  title?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: ContentStatus;
  authorId: string;
  authorName: string;
  reviewerId?: string;
  reviewNotes?: string;
  publishedAt?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  organizer: string;
  coverImage: string;
  isFeatured: boolean;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export type HeritageCategory =
  | 'VILLAGE_HISTORY'
  | 'CUSTOMS'
  | 'LANGUAGE'
  | 'ROYAL_LINEAGE'
  | 'HISTORICAL_ARTIFACTS';

export interface Heritage {
  id: string;
  title: string;
  category: HeritageCategory;
  summary: string;
  content: string;
  supportingMedia: string[];
  oralTraditionSource?: string;
  status: ContentStatus;
  authorId: string;
  authorName: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leadership {
  id: string;
  name: string;
  traditionalTitle: string;
  biography: string;
  activePeriod: string;
  portraitPhoto: string;
  displayOrder: number;
  lineage?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export type MediaType = 'PHOTO' | 'VIDEO';

export interface Gallery {
  id: string;
  title: string;
  mediaType: MediaType;
  album: string;
  category: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  description: string;
  tags: string[];
  status: ContentStatus;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PublicationFileType = 'PDF' | 'EPUB' | 'DOCX' | 'EXTERNAL_LINK';

export interface Publication {
  id: string;
  title: string;
  description: string;
  author: string;
  publicationDate: string;
  documentUrl: string;
  fileType: PublicationFileType;
  fileSize?: string;
  coverImage?: string;
  status: ContentStatus;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export interface DevelopmentProject {
  id: string;
  projectName: string;
  description: string;
  location: string;
  budgetXAF: number;
  status: ProjectStatus;
  progressPercentage: number;
  coverImage: string;
  startDate: string;
  completionDate?: string;
  leadCoordinator: string;
  fundingSource: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactStatus = 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED';

export interface ContactSubmission {
  id: string;
  senderName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  internalNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'SUSPEND'
  | 'ACTIVATE'
  | 'APPROVE'
  | 'REJECT'
  | 'ARCHIVE';

export type EntityType =
  | 'Users'
  | 'News'
  | 'Events'
  | 'Heritage'
  | 'Leadership'
  | 'Gallery'
  | 'Publications'
  | 'DevelopmentProjects'
  | 'ContactSubmissions';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityTitle?: string;
  adminId: string;
  adminName: string;
  adminRole: Role;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  upcomingEvents: number;
  heritageRecords: number;
  galleryItems: number;
  publicationsCount: number;
  developmentProjectsCount: number;
  registeredAdmins: number;
  pendingReviews: number;
  unreadMessages: number;
}
