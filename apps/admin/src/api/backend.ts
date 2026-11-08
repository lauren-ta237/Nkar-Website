import {
  User,
  News,
  EventItem,
  Heritage,
  Leadership,
  Gallery,
  Publication,
  DevelopmentProject,
  ContactSubmission,
  AuditLog,
  DashboardStats,
  Role,
  EntityType,
  AuditAction,
  ContentStatus,
} from '../types';

import {
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_HERITAGE,
  INITIAL_LEADERSHIP,
  INITIAL_GALLERY,
  INITIAL_PUBLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_CONTACT_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
} from '../db/initialData';
import { INITIAL_USERS } from '../store/useAdminStore';

const STORAGE_KEYS = {
  USERS: 'nkar_db_users_v1',
  NEWS: 'nkar_db_news_v1',
  EVENTS: 'nkar_db_events_v1',
  HERITAGE: 'nkar_db_heritage_v1',
  LEADERSHIP: 'nkar_db_leadership_v1',
  GALLERY: 'nkar_db_gallery_v1',
  PUBLICATIONS: 'nkar_db_publications_v1',
  PROJECTS: 'nkar_db_projects_v1',
  CONTACT: 'nkar_db_contact_v1',
  AUDIT: 'nkar_db_audit_v1',
};

// Storage helper with fallback
function loadData<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn('LocalStorage unavailable, using initial data:', e);
  }
  return initial;
}

function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Database In-Memory Cache synced with Storage
let users: User[] = loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
let news: News[] = loadData(STORAGE_KEYS.NEWS, INITIAL_NEWS);
let events: EventItem[] = loadData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
let heritage: Heritage[] = loadData(STORAGE_KEYS.HERITAGE, INITIAL_HERITAGE);
let leadership: Leadership[] = loadData(STORAGE_KEYS.LEADERSHIP, INITIAL_LEADERSHIP);
let gallery: Gallery[] = loadData(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
let publications: Publication[] = loadData(STORAGE_KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS);
let projects: DevelopmentProject[] = loadData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
let contacts: ContactSubmission[] = loadData(STORAGE_KEYS.CONTACT, INITIAL_CONTACT_SUBMISSIONS);
let auditLogs: AuditLog[] = loadData(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);

// Audit Logger
function createAuditRecord(
  action: AuditAction,
  entityType: EntityType,
  entityId: string,
  entityTitle: string | undefined,
  admin: User,
  details: string
) {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action,
    entityType,
    entityId,
    entityTitle,
    adminId: admin.id,
    adminName: admin.name,
    adminRole: admin.role,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLogs = [newLog, ...auditLogs];
  saveData(STORAGE_KEYS.AUDIT, auditLogs);
}

// Permission checking helper
function assertPermission(admin: User, allowedRoles: Role[], actionDescription: string) {
  if (admin.status === 'SUSPENDED') {
    throw new Error(`Access Denied: Your account (${admin.name}) is currently SUSPENDED.`);
  }
  if (!allowedRoles.includes(admin.role)) {
    throw new Error(
      `Permission Denied: Your role (${admin.role}) is not authorized to ${actionDescription}.`
    );
  }
}

export const backendApi = {
  // Reset all data to factory demo state
  resetAllData: () => {
    users = [...INITIAL_USERS];
    news = [...INITIAL_NEWS];
    events = [...INITIAL_EVENTS];
    heritage = [...INITIAL_HERITAGE];
    leadership = [...INITIAL_LEADERSHIP];
    gallery = [...INITIAL_GALLERY];
    publications = [...INITIAL_PUBLICATIONS];
    projects = [...INITIAL_PROJECTS];
    contacts = [...INITIAL_CONTACT_SUBMISSIONS];
    auditLogs = [...INITIAL_AUDIT_LOGS];

    saveData(STORAGE_KEYS.USERS, users);
    saveData(STORAGE_KEYS.NEWS, news);
    saveData(STORAGE_KEYS.EVENTS, events);
    saveData(STORAGE_KEYS.HERITAGE, heritage);
    saveData(STORAGE_KEYS.LEADERSHIP, leadership);
    saveData(STORAGE_KEYS.GALLERY, gallery);
    saveData(STORAGE_KEYS.PUBLICATIONS, publications);
    saveData(STORAGE_KEYS.PROJECTS, projects);
    saveData(STORAGE_KEYS.CONTACT, contacts);
    saveData(STORAGE_KEYS.AUDIT, auditLogs);
  },

  // Dashboard Live Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = events.filter((e) => e.eventDate >= today && e.status === 'PUBLISHED').length;
    const publishedNews = news.filter((n) => n.status === 'PUBLISHED').length;
    
    // Count items awaiting review across all modules
    const pendingNews = news.filter((n) => n.status === 'SUBMITTED').length;
    const pendingEvents = events.filter((e) => e.status === 'SUBMITTED').length;
    const pendingHeritage = heritage.filter((h) => h.status === 'SUBMITTED').length;
    const pendingGallery = gallery.filter((g) => g.status === 'SUBMITTED').length;
    const pendingPubs = publications.filter((p) => p.status === 'SUBMITTED').length;
    const totalPendingReviews = pendingNews + pendingEvents + pendingHeritage + pendingGallery + pendingPubs;

    const unreadMessages = contacts.filter((c) => c.status === 'UNREAD').length;

    return {
      totalNews: news.length,
      publishedNews,
      upcomingEvents,
      heritageRecords: heritage.length,
      galleryItems: gallery.length,
      publicationsCount: publications.length,
      developmentProjectsCount: projects.length,
      registeredAdmins: users.length,
      pendingReviews: totalPendingReviews,
      unreadMessages,
    };
  },

  // Review Queue Items (Cross-Module)
  getPendingReviewItems: async () => {
    const items: Array<{
      id: string;
      type: EntityType;
      title: string;
      category?: string;
      submittedBy: string;
      createdAt: string;
      status: ContentStatus;
      coverImage?: string;
    }> = [];

    news
      .filter((n) => n.status === 'SUBMITTED')
      .forEach((n) =>
        items.push({
          id: n.id,
          type: 'News',
          title: n.title,
          category: n.category,
          submittedBy: n.authorName,
          createdAt: n.createdAt,
          status: n.status,
          coverImage: n.coverImage,
        })
      );

    events
      .filter((e) => e.status === 'SUBMITTED')
      .forEach((e) =>
        items.push({
          id: e.id,
          type: 'Events',
          title: e.title,
          category: 'Event',
          submittedBy: e.organizer,
          createdAt: e.createdAt,
          status: e.status,
          coverImage: e.coverImage,
        })
      );

    heritage
      .filter((h) => h.status === 'SUBMITTED')
      .forEach((h) =>
        items.push({
          id: h.id,
          type: 'Heritage',
          title: h.title,
          category: h.category,
          submittedBy: h.authorName,
          createdAt: h.createdAt,
          status: h.status,
          coverImage: h.supportingMedia[0],
        })
      );

    publications
      .filter((p) => p.status === 'SUBMITTED')
      .forEach((p) =>
        items.push({
          id: p.id,
          type: 'Publications',
          title: p.title,
          category: p.fileType,
          submittedBy: p.author,
          createdAt: p.createdAt,
          status: p.status,
          coverImage: p.coverImage,
        })
      );

    gallery
      .filter((g) => g.status === 'SUBMITTED')
      .forEach((g) =>
        items.push({
          id: g.id,
          type: 'Gallery',
          title: g.title,
          category: g.album,
          submittedBy: g.uploadedBy,
          createdAt: g.createdAt,
          status: g.status,
          coverImage: g.thumbnailUrl || g.mediaUrl,
        })
      );

    return items;
  },

  // USERS MODULE (SUPER_ADMIN only for changes)
  users: {
    list: async (admin: User): Promise<User[]> => {
      // Any authenticated admin can view administrators list for collaboration
      return [...users];
    },
    create: async (admin: User, data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'create new administrators');
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error(`Administrator with email "${data.email}" already exists.`);
      }
      const newUser: User = {
        ...data,
        id: `usr-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users = [...users, newUser];
      saveData(STORAGE_KEYS.USERS, users);
      createAuditRecord('CREATE', 'Users', newUser.id, newUser.name, admin, `Created administrator ${newUser.name} with role ${newUser.role}`);
      return newUser;
    },
    update: async (admin: User, id: string, updates: Partial<User>): Promise<User> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'modify administrator accounts');
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');
      
      // CRITICAL SECURITY: Role modification checks
      if (updates.role && updates.role !== users[idx].role) {
        if (admin.role !== 'SUPER_ADMIN') {
          throw new Error('Security Violation: Only Super Admins can assign or modify administrator roles.');
        }
        if (id === admin.id) {
          throw new Error('Security Violation: Administrators must not change their own role.');
        }
        const validRoles: Role[] = ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'];
        if (!validRoles.includes(updates.role)) {
          throw new Error(`Invalid role "${updates.role}". Must be one of: ${validRoles.join(', ')}`);
        }
        createAuditRecord(
          'UPDATE',
          'Users',
          id,
          users[idx].name,
          admin,
          `Super Admin ${admin.name} changed role of ${users[idx].name} from ${users[idx].role} to ${updates.role}`
        );
      }

      if (updates.email && updates.email.toLowerCase() !== users[idx].email.toLowerCase()) {
        if (users.some((u) => u.id !== id && u.email.toLowerCase() === updates.email!.toLowerCase())) {
          throw new Error(`Administrator with email "${updates.email}" already exists.`);
        }
      }

      const updatedUser: User = {
        ...users[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      users[idx] = updatedUser;
      saveData(STORAGE_KEYS.USERS, users);
      createAuditRecord('UPDATE', 'Users', id, updatedUser.name, admin, `Updated user details for ${updatedUser.name}`);
      return updatedUser;
    },
    updateProfile: async (
      admin: User,
      updates: { name?: string; email?: string; phone?: string; title?: string; avatar?: string }
    ): Promise<User> => {
      if (admin.status === 'SUSPENDED') {
        throw new Error(`Access Denied: Your account (${admin.name}) is currently SUSPENDED.`);
      }
      // Strictly prevent unauthorized role modification through profile endpoint
      if ('role' in (updates as any) || 'status' in (updates as any)) {
        throw new Error('Security Violation: Roles and status cannot be modified via administrator profile.');
      }

      const idx = users.findIndex((u) => u.id === admin.id);
      if (idx === -1) throw new Error('Administrator account not found');

      if (updates.email && updates.email.trim().toLowerCase() !== users[idx].email.toLowerCase()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email.trim())) {
          throw new Error('Invalid email address format.');
        }
        if (users.some((u) => u.id !== admin.id && u.email.toLowerCase() === updates.email!.trim().toLowerCase())) {
          throw new Error(`Email "${updates.email}" is already used by another administrator.`);
        }
      }

      if (updates.name && !updates.name.trim()) {
        throw new Error('Name cannot be empty.');
      }

      const updatedUser: User = {
        ...users[idx],
        name: updates.name ? updates.name.trim() : users[idx].name,
        email: updates.email ? updates.email.trim() : users[idx].email,
        phone: updates.phone !== undefined ? updates.phone.trim() : users[idx].phone,
        title: updates.title !== undefined ? updates.title.trim() : users[idx].title,
        avatar: updates.avatar !== undefined ? updates.avatar.trim() : users[idx].avatar,
        updatedAt: new Date().toISOString(),
      };

      users[idx] = updatedUser;
      saveData(STORAGE_KEYS.USERS, users);
      createAuditRecord(
        'UPDATE',
        'Users',
        updatedUser.id,
        updatedUser.name,
        updatedUser,
        `Administrator ${updatedUser.name} updated their profile information`
      );
      return updatedUser;
    },
    toggleStatus: async (admin: User, id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<User> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'change account activation status');
      if (id === admin.id) {
        throw new Error('Security Violation: You cannot suspend your own administrative account.');
      }
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');

      users[idx] = {
        ...users[idx],
        status,
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.USERS, users);
      createAuditRecord(
        status === 'SUSPENDED' ? 'SUSPEND' : 'ACTIVATE',
        'Users',
        id,
        users[idx].name,
        admin,
        `${status === 'SUSPENDED' ? 'Suspended' : 'Activated'} administrator account of ${users[idx].name}`
      );
      return users[idx];
    },
  },

  // NEWS MODULE
  news: {
    list: async (): Promise<News[]> => [...news],
    getById: async (id: string): Promise<News | undefined> => news.find((n) => n.id === id),
    create: async (admin: User, item: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>): Promise<News> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'], 'create news articles');
      // Content editor cannot directly publish
      const effectiveStatus: ContentStatus =
        admin.role === 'CONTENT_EDITOR' && (item.status === 'PUBLISHED' || item.status === 'APPROVED')
          ? 'SUBMITTED'
          : item.status;

      const newArticle: News = {
        ...item,
        id: `news-${Date.now()}`,
        status: effectiveStatus,
        viewsCount: 0,
        publishedAt: effectiveStatus === 'PUBLISHED' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      news = [newArticle, ...news];
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('CREATE', 'News', newArticle.id, newArticle.title, admin, `Created news article "${newArticle.title}" with status ${effectiveStatus}`);
      return newArticle;
    },
    update: async (admin: User, id: string, updates: Partial<News>): Promise<News> => {
      const idx = news.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('News article not found');

      const existing = news[idx];
      // Check author if editor
      if (admin.role === 'CONTENT_EDITOR' && existing.authorId !== admin.id) {
        throw new Error('Permission Denied: Content Editors can only modify their own articles.');
      }

      // Check if editor tries to publish
      if (admin.role === 'CONTENT_EDITOR' && updates.status && ['PUBLISHED', 'APPROVED'].includes(updates.status)) {
        throw new Error('Permission Denied: Content Editors cannot approve or publish articles.');
      }

      const updated: News = {
        ...existing,
        ...updates,
        publishedAt: updates.status === 'PUBLISHED' && !existing.publishedAt ? new Date().toISOString() : existing.publishedAt,
        updatedAt: new Date().toISOString(),
      };
      news[idx] = updated;
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('UPDATE', 'News', id, updated.title, admin, `Updated news article "${updated.title}"`);
      return updated;
    },
    approve: async (admin: User, id: string, notes?: string): Promise<News> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'approve content');
      const idx = news.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('News not found');
      news[idx] = {
        ...news[idx],
        status: 'APPROVED',
        reviewerId: admin.id,
        reviewNotes: notes,
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('APPROVE', 'News', id, news[idx].title, admin, `Approved article "${news[idx].title}"`);
      return news[idx];
    },
    reject: async (admin: User, id: string, notes: string): Promise<News> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'reject content');
      if (!notes?.trim()) throw new Error('Review notes are strictly required when rejecting content.');
      const idx = news.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('News not found');
      news[idx] = {
        ...news[idx],
        status: 'REJECTED',
        reviewerId: admin.id,
        reviewNotes: notes,
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('REJECT', 'News', id, news[idx].title, admin, `Rejected article "${news[idx].title}". Notes: ${notes}`);
      return news[idx];
    },
    publish: async (admin: User, id: string): Promise<News> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'publish content');
      const idx = news.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('News not found');
      news[idx] = {
        ...news[idx],
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('PUBLISH', 'News', id, news[idx].title, admin, `Published news article "${news[idx].title}" to the live platform.`);
      return news[idx];
    },
    archive: async (admin: User, id: string): Promise<News> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'archive published content');
      const idx = news.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('News not found');
      news[idx] = {
        ...news[idx],
        status: 'ARCHIVED',
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.NEWS, news);
      createAuditRecord('ARCHIVE', 'News', id, news[idx].title, admin, `Archived article "${news[idx].title}"`);
      return news[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete content permanently');
      const item = news.find((n) => n.id === id);
      news = news.filter((n) => n.id !== id);
      saveData(STORAGE_KEYS.NEWS, news);
      if (item) {
        createAuditRecord('DELETE', 'News', id, item.title, admin, `Permanently deleted article "${item.title}"`);
      }
    },
  },

  // EVENTS MODULE
  events: {
    list: async (): Promise<EventItem[]> => [...events],
    create: async (admin: User, item: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventItem> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'], 'create cultural events');
      const effectiveStatus: ContentStatus =
        admin.role === 'CONTENT_EDITOR' && item.status === 'PUBLISHED' ? 'SUBMITTED' : item.status;

      const newEvent: EventItem = {
        ...item,
        id: `evt-${Date.now()}`,
        status: effectiveStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      events = [newEvent, ...events];
      saveData(STORAGE_KEYS.EVENTS, events);
      createAuditRecord('CREATE', 'Events', newEvent.id, newEvent.title, admin, `Created event "${newEvent.title}"`);
      return newEvent;
    },
    update: async (admin: User, id: string, updates: Partial<EventItem>): Promise<EventItem> => {
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Event not found');
      if (admin.role === 'CONTENT_EDITOR' && events[idx].authorId !== admin.id) {
        throw new Error('Permission Denied: Content Editors can only modify their own events.');
      }
      const updated: EventItem = {
        ...events[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      events[idx] = updated;
      saveData(STORAGE_KEYS.EVENTS, events);
      createAuditRecord('UPDATE', 'Events', id, updated.title, admin, `Updated event "${updated.title}"`);
      return updated;
    },
    publish: async (admin: User, id: string): Promise<EventItem> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'publish events');
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Event not found');
      events[idx] = { ...events[idx], status: 'PUBLISHED', updatedAt: new Date().toISOString() };
      saveData(STORAGE_KEYS.EVENTS, events);
      createAuditRecord('PUBLISH', 'Events', id, events[idx].title, admin, `Published event "${events[idx].title}"`);
      return events[idx];
    },
    archive: async (admin: User, id: string): Promise<EventItem> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'archive events');
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error('Event not found');
      events[idx] = { ...events[idx], status: 'ARCHIVED', updatedAt: new Date().toISOString() };
      saveData(STORAGE_KEYS.EVENTS, events);
      createAuditRecord('ARCHIVE', 'Events', id, events[idx].title, admin, `Archived event "${events[idx].title}"`);
      return events[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete events');
      const item = events.find((e) => e.id === id);
      events = events.filter((e) => e.id !== id);
      saveData(STORAGE_KEYS.EVENTS, events);
      if (item) createAuditRecord('DELETE', 'Events', id, item.title, admin, `Deleted event "${item.title}"`);
    },
  },

  // HERITAGE MODULE
  heritage: {
    list: async (): Promise<Heritage[]> => [...heritage],
    create: async (admin: User, item: Omit<Heritage, 'id' | 'createdAt' | 'updatedAt'>): Promise<Heritage> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'], 'record heritage assets');
      const effectiveStatus: ContentStatus =
        admin.role === 'CONTENT_EDITOR' && item.status === 'PUBLISHED' ? 'SUBMITTED' : item.status;

      const newHeritage: Heritage = {
        ...item,
        id: `hrt-${Date.now()}`,
        status: effectiveStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      heritage = [newHeritage, ...heritage];
      saveData(STORAGE_KEYS.HERITAGE, heritage);
      createAuditRecord('CREATE', 'Heritage', newHeritage.id, newHeritage.title, admin, `Recorded heritage entry "${newHeritage.title}"`);
      return newHeritage;
    },
    update: async (admin: User, id: string, updates: Partial<Heritage>): Promise<Heritage> => {
      const idx = heritage.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error('Heritage record not found');
      const updated: Heritage = {
        ...heritage[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      heritage[idx] = updated;
      saveData(STORAGE_KEYS.HERITAGE, heritage);
      createAuditRecord('UPDATE', 'Heritage', id, updated.title, admin, `Updated heritage record "${updated.title}"`);
      return updated;
    },
    publish: async (admin: User, id: string): Promise<Heritage> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'publish heritage records');
      const idx = heritage.findIndex((h) => h.id === id);
      if (idx === -1) throw new Error('Heritage record not found');
      heritage[idx] = { ...heritage[idx], status: 'PUBLISHED', updatedAt: new Date().toISOString() };
      saveData(STORAGE_KEYS.HERITAGE, heritage);
      createAuditRecord('PUBLISH', 'Heritage', id, heritage[idx].title, admin, `Published heritage entry "${heritage[idx].title}"`);
      return heritage[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete heritage records');
      const item = heritage.find((h) => h.id === id);
      heritage = heritage.filter((h) => h.id !== id);
      saveData(STORAGE_KEYS.HERITAGE, heritage);
      if (item) createAuditRecord('DELETE', 'Heritage', id, item.title, admin, `Deleted heritage entry "${item.title}"`);
    },
  },

  // LEADERSHIP MODULE
  leadership: {
    list: async (): Promise<Leadership[]> => {
      return [...leadership].sort((a, b) => a.displayOrder - b.displayOrder);
    },
    create: async (admin: User, item: Omit<Leadership, 'id' | 'createdAt' | 'updatedAt'>): Promise<Leadership> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'manage traditional leadership directory');
      const newLeader: Leadership = {
        ...item,
        id: `ldr-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      leadership = [...leadership, newLeader];
      saveData(STORAGE_KEYS.LEADERSHIP, leadership);
      createAuditRecord('CREATE', 'Leadership', newLeader.id, newLeader.name, admin, `Added traditional leader "${newLeader.name} (${newLeader.traditionalTitle})"`);
      return newLeader;
    },
    update: async (admin: User, id: string, updates: Partial<Leadership>): Promise<Leadership> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'update leadership profiles');
      const idx = leadership.findIndex((l) => l.id === id);
      if (idx === -1) throw new Error('Leader not found');
      const updated: Leadership = {
        ...leadership[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      leadership[idx] = updated;
      saveData(STORAGE_KEYS.LEADERSHIP, leadership);
      createAuditRecord('UPDATE', 'Leadership', id, updated.name, admin, `Updated leader profile "${updated.name}"`);
      return updated;
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete royal leadership profiles');
      const item = leadership.find((l) => l.id === id);
      leadership = leadership.filter((l) => l.id !== id);
      saveData(STORAGE_KEYS.LEADERSHIP, leadership);
      if (item) createAuditRecord('DELETE', 'Leadership', id, item.name, admin, `Removed traditional leader "${item.name}"`);
    },
  },

  // GALLERY MODULE
  gallery: {
    list: async (): Promise<Gallery[]> => [...gallery],
    create: async (admin: User, item: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Gallery> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'], 'upload gallery media');
      const effectiveStatus: ContentStatus =
        admin.role === 'CONTENT_EDITOR' && item.status === 'PUBLISHED' ? 'SUBMITTED' : item.status;

      const newMedia: Gallery = {
        ...item,
        id: `gal-${Date.now()}`,
        status: effectiveStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      gallery = [newMedia, ...gallery];
      saveData(STORAGE_KEYS.GALLERY, gallery);
      createAuditRecord('CREATE', 'Gallery', newMedia.id, newMedia.title, admin, `Uploaded media item "${newMedia.title}" into album "${newMedia.album}"`);
      return newMedia;
    },
    update: async (admin: User, id: string, updates: Partial<Gallery>): Promise<Gallery> => {
      const idx = gallery.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error('Gallery item not found');
      const updated: Gallery = {
        ...gallery[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      gallery[idx] = updated;
      saveData(STORAGE_KEYS.GALLERY, gallery);
      createAuditRecord('UPDATE', 'Gallery', id, updated.title, admin, `Updated gallery item "${updated.title}"`);
      return updated;
    },
    publish: async (admin: User, id: string): Promise<Gallery> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'publish gallery items');
      const idx = gallery.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error('Gallery item not found');
      gallery[idx] = { ...gallery[idx], status: 'PUBLISHED', updatedAt: new Date().toISOString() };
      saveData(STORAGE_KEYS.GALLERY, gallery);
      createAuditRecord('PUBLISH', 'Gallery', id, gallery[idx].title, admin, `Published gallery item "${gallery[idx].title}"`);
      return gallery[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete gallery media');
      const item = gallery.find((g) => g.id === id);
      gallery = gallery.filter((g) => g.id !== id);
      saveData(STORAGE_KEYS.GALLERY, gallery);
      if (item) createAuditRecord('DELETE', 'Gallery', id, item.title, admin, `Deleted gallery item "${item.title}"`);
    },
  },

  // PUBLICATIONS MODULE
  publications: {
    list: async (): Promise<Publication[]> => [...publications],
    create: async (admin: User, item: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Publication> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'CONTENT_REVIEWER'], 'add books and publications');
      const effectiveStatus: ContentStatus =
        admin.role === 'CONTENT_EDITOR' && item.status === 'PUBLISHED' ? 'SUBMITTED' : item.status;

      const newPub: Publication = {
        ...item,
        id: `pub-${Date.now()}`,
        status: effectiveStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      publications = [newPub, ...publications];
      saveData(STORAGE_KEYS.PUBLICATIONS, publications);
      createAuditRecord('CREATE', 'Publications', newPub.id, newPub.title, admin, `Registered publication "${newPub.title}"`);
      return newPub;
    },
    update: async (admin: User, id: string, updates: Partial<Publication>): Promise<Publication> => {
      const idx = publications.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Publication not found');
      const updated: Publication = {
        ...publications[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      publications[idx] = updated;
      saveData(STORAGE_KEYS.PUBLICATIONS, publications);
      createAuditRecord('UPDATE', 'Publications', id, updated.title, admin, `Updated publication "${updated.title}"`);
      return updated;
    },
    publish: async (admin: User, id: string): Promise<Publication> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'publish publications');
      const idx = publications.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Publication not found');
      publications[idx] = { ...publications[idx], status: 'PUBLISHED', updatedAt: new Date().toISOString() };
      saveData(STORAGE_KEYS.PUBLICATIONS, publications);
      createAuditRecord('PUBLISH', 'Publications', id, publications[idx].title, admin, `Published publication "${publications[idx].title}"`);
      return publications[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete publications');
      const item = publications.find((p) => p.id === id);
      publications = publications.filter((p) => p.id !== id);
      saveData(STORAGE_KEYS.PUBLICATIONS, publications);
      if (item) createAuditRecord('DELETE', 'Publications', id, item.title, admin, `Deleted publication "${item.title}"`);
    },
  },

  // DEVELOPMENT PROJECTS MODULE
  projects: {
    list: async (): Promise<DevelopmentProject[]> => [...projects],
    create: async (admin: User, item: Omit<DevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<DevelopmentProject> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'create development projects');
      const newProj: DevelopmentProject = {
        ...item,
        id: `prj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects = [newProj, ...projects];
      saveData(STORAGE_KEYS.PROJECTS, projects);
      createAuditRecord('CREATE', 'DevelopmentProjects', newProj.id, newProj.projectName, admin, `Initiated community project "${newProj.projectName}" with budget ${newProj.budgetXAF.toLocaleString()} XAF`);
      return newProj;
    },
    update: async (admin: User, id: string, updates: Partial<DevelopmentProject>): Promise<DevelopmentProject> => {
      assertPermission(admin, ['SUPER_ADMIN', 'CONTENT_REVIEWER'], 'update development projects');
      const idx = projects.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Project not found');
      const updated: DevelopmentProject = {
        ...projects[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      projects[idx] = updated;
      saveData(STORAGE_KEYS.PROJECTS, projects);
      createAuditRecord('UPDATE', 'DevelopmentProjects', id, updated.projectName, admin, `Updated development project "${updated.projectName}" (Progress: ${updated.progressPercentage}%)`);
      return updated;
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete development projects');
      const item = projects.find((p) => p.id === id);
      projects = projects.filter((p) => p.id !== id);
      saveData(STORAGE_KEYS.PROJECTS, projects);
      if (item) createAuditRecord('DELETE', 'DevelopmentProjects', id, item.projectName, admin, `Removed development project "${item.projectName}"`);
    },
  },

  // CONTACT SUBMISSIONS (INBOX)
  contacts: {
    list: async (): Promise<ContactSubmission[]> => [...contacts],
    updateStatus: async (admin: User, id: string, status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED', notes?: string): Promise<ContactSubmission> => {
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Submission not found');
      contacts[idx] = {
        ...contacts[idx],
        status,
        internalNotes: notes !== undefined ? notes : contacts[idx].internalNotes,
        assignedTo: admin.name,
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.CONTACT, contacts);
      createAuditRecord('UPDATE', 'ContactSubmissions', id, contacts[idx].subject, admin, `Updated submission status to ${status} for "${contacts[idx].subject}"`);
      return contacts[idx];
    },
    delete: async (admin: User, id: string): Promise<void> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'delete contact inquiries');
      contacts = contacts.filter((c) => c.id !== id);
      saveData(STORAGE_KEYS.CONTACT, contacts);
      createAuditRecord('DELETE', 'ContactSubmissions', id, 'Inquiry Deleted', admin, `Deleted message inquiry #${id}`);
    },
  },

  // AUDIT LOGS (SUPER_ADMIN only to view; immutable)
  auditLogs: {
    list: async (admin: User): Promise<AuditLog[]> => {
      assertPermission(admin, ['SUPER_ADMIN'], 'inspect system audit logs');
      return [...auditLogs];
    },
  },
};
