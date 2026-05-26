import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  CLIENT_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string(),
  INTROSPECTION_SECRET: z.string(),
  REDIS_URL: z.string(),
});
