// src/lib/api/index.ts
//
// Barrel export for all API modules in apps/admin/src/lib/api/.
// Every domain module exposes pure async functions and useAdmin<Entity>... hooks.

export * from './config/axios-client';
export * from './auth.api';
export * from './dashboard.api';
export * from './news.api';
export * from './events.api';
export * from './heritage.api';
export * from './leadership.api';
export * from './gallery.api';
export * from './publications.api';
export * from './projects.api';
export * from './contacts.api';
export * from './users.api';
export * from './audit.api';
export * from './media.api';
