// axios-client.ts
//
// Single axios instance used by every API module in src/lib/api/.
//
// - baseURL comes from VITE_API_URL (production) with a `/api` fallback
//   for local dev, so the same client works against any backend.
// - request interceptor attaches the auth token (see auth-token.ts).
// - response interceptor normalizes errors into a single ApiError shape and
//   clears a dead token on 401 so a single retry can re-authenticate.

import axios, { AxiosError } from "axios";
import { getToken, clearToken } from "../../auth-token";
import { env } from "@/lib/env";

const BASE_URL = `${env.API_URL}/api/v1`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // cookie-backed sessions still work alongside the bearer token
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- request interceptor -------------------------------------------------

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---- response interceptor ------------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error?.response?.status;

    // A 401 means the token (if any) is dead — drop it so the next call can
    // re-authenticate instead of replaying a doomed request forever.
    if (status === 401) {
      clearToken();
    }

    const message =
      (error?.response?.data as { message?: string } | undefined)?.message ||
      error?.message ||
      "Request failed";

    const normalized = new Error(message);
    normalized.name = "ApiError";
    (normalized as Error & { status: number | null }).status = status || null;
    (normalized as Error & { payload: unknown }).payload = error?.response?.data || null;
    return Promise.reject(normalized);
  }
);

export default api;