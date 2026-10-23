// index.js
//
// Barrel for the API layer. Import from here instead of reaching into the
// individual modules — keeps call sites one line and makes swapping the
// transport trivial.
//
//   import { api, login, useMe } from '@/lib/api';

export { api, default } from "./axios-client";
export * from "./auth-token";
export * from "./auth.api";