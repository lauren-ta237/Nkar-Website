// auth.api.ts
//
// Demo authentication API route module + TanStack Query hooks.
//
// Every function here is a thin wrapper around the shared axios instance in
// axios-client.js. Nothing auth-specific lives in the interceptor â€” the token
// is attached by auth-token.js, so this file only describes the routes.
//
// These are DEMO endpoints: the project has no backend, so they will 404
// against a real server until one is wired up. The shapes below are the
// contract the frontend assumes, and the hooks in this file consume them
// through TanStack Query.

import { api } from "./config/axios-client";
import { setToken, clearToken, getToken } from "../auth-token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Role, UserStatus } from "@/types";

// ---- types ---------------------------------------------------------------

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export function normalizeAuthUser(raw: AuthUser | any): User {
  if (!raw) {
    return {
      id: 'usr-fallback',
      name: 'Administrator',
      email: 'admin@nkarwoolan.org',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const roleUpper = (raw.role || 'content_editor').toUpperCase();
  const role: Role =
    roleUpper === 'SUPER_ADMIN'
      ? 'SUPER_ADMIN'
      : roleUpper === 'CONTENT_REVIEWER'
      ? 'CONTENT_REVIEWER'
      : 'CONTENT_EDITOR';

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role,
    status: (raw.status?.toUpperCase() || 'ACTIVE') as UserStatus,
    avatar_url: raw.avatar_url ? String(raw.avatar_url).trim().replace(/^http:\/\//i, 'https://') : null,
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
  };
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token?: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

// ---- routes --------------------------------------------------------------

/**
 * POST /auth/login
 * Returns a bearer token + the authenticated user.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  const token = res.data.access_token || res.data.token;
  if (token) {
    setToken(token);
  }
  return res.data;
}

/**
 * POST /auth/register
 * Returns a bearer token + the newly created user.
 */
export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const res = await api.post<RegisterResponse>("/auth/register", payload);
  if (res.data.access_token) {
    setToken(res.data.access_token);
  }
  return res.data;
}

/**
 * GET /auth/me
 * Returns the currently authenticated user, or 401 if none.
 */
export async function me(): Promise<AuthUser> {
  const res = await api.get<any>("/auth/me");
  return res.data?.data ?? res.data;
}

/**
 * POST /auth/logout
 * Best-effort server-side session clear; always clears the local token.
 */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore errors â€“ logout should succeed even if the server is unreachable
  } finally {
    clearToken();
  }
}

// ---- hooks ---------------------------------------------------------------

export const AUTH_QUERY_KEYS = {
  ALL: ["nkar", "auth"] as const,
  ME: ["nkar", "auth", "me"] as const,
};

/** GET /auth/me */
export function useMe(options: { enabled?: boolean; retry?: number | boolean } = {}) {
  const token = typeof window !== 'undefined' ? getToken() : null;
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.ME,
    queryFn: () => me(),
    enabled: options.enabled ?? Boolean(token),
    retry: options.retry ?? false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/** POST /auth/login */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ALL });
    },
  });
}

/** POST /auth/register */
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ALL });
    },
  });
}

/** POST /auth/logout */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.ALL });
    },
  });
}
