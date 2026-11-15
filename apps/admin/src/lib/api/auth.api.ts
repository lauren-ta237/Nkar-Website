// auth.api.ts
//
// Demo authentication API route module + TanStack Query hooks.
//
// Every function here is a thin wrapper around the shared axios instance in
// axios-client.js. Nothing auth-specific lives in the interceptor — the token
// is attached by auth-token.js, so this file only describes the routes.
//
// These are DEMO endpoints: the project has no backend, so they will 404
// against a real server until one is wired up. The shapes below are the
// contract the frontend assumes, and the hooks in this file consume them
// through TanStack Query.

import { api } from "./config/axios-client";
import { setToken, clearToken } from "../auth-token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ---- types ---------------------------------------------------------------

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  token: string;
  user: AuthUser;
};

// ---- routes --------------------------------------------------------------

/**
 * POST /auth/login
 * Returns a bearer token + the authenticated user.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  setToken(res.data.token);
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
  setToken(res.data.token);
  return res.data;
}

/**
 * GET /auth/me
 * Returns the currently authenticated user, or 401 if none.
 */
export async function me(): Promise<AuthUser> {
  const res = await api.get<AuthUser>("/auth/me");
  return res.data;
}

/**
 * POST /auth/logout
 * Best-effort server-side session clear; always clears the local token.
 */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore errors – logout should succeed even if the server is unreachable
  } finally {
    clearToken();
  }
}

// ---- hooks ---------------------------------------------------------------

const AUTH_KEY = ["nkar", "auth"];

/** GET /auth/me — re-fetched on window focus by default; disable per-call if needed. */
export function useMe(options = {}) {
  return useQuery({
    queryKey: [...AUTH_KEY, "me"],
    queryFn: () => me(),
    ...options,
  });
}

/** POST /auth/login — a write, so useMutation. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

/** POST /auth/register — a write, so useMutation. */
export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

/** POST /auth/logout — clears the token on success. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_KEY });
    },
  });
}