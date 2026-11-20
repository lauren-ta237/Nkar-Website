import { z } from "zod";

const envSchema = z.object({
  ENV: z.enum(["development", "production"]).default("development"),
  API_URL: z.string().url().default("http://localhost:8000"),
});

export const env = envSchema.parse({
  ENV: import.meta.env.VITE_ENV || "development",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const __DEV__ = env.ENV === "development";


