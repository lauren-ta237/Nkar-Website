import { z } from "zod";

const envSchema = z.object({
  ENV: z.enum(["development", "production", "test"]).default("development"),
  API_URL: z.string().default("http://localhost:8000"),
  USE_MOCK_STORAGE: z.string().optional().default("true"),
  SITE_URL: z.string().optional().default("http://localhost:5173"),
});

export const env = envSchema.parse({
  ENV: import.meta.env.VITE_ENV || (import.meta.env.DEV ? "development" : "production"),
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  USE_MOCK_STORAGE: import.meta.env.VITE_USE_MOCK_STORAGE,
  SITE_URL: import.meta.env.VITE_SITE_URL,
});

export const __DEV__ = env.ENV === "development";
