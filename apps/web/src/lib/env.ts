import { z } from "zod";

const envSchema = z.object({
  ENV: z.enum(["development", "production"]).default("development"),
  API_URL: z.url(),
});

export const env = envSchema.parse({
  ENV: import.meta.env.VITE_ENV ,
  API_URL: import.meta.env.VITE_API_URL,
});

export const __DEV__ = env.ENV === "development";


