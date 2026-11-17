import dotenv from "dotenv";
import { z } from "zod";
import process from "node:process";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  NODE_ENV: z.enum([
    "development",
    "production",
    "test"
  ]).default("development"),

  MONGODB_URI: z.string().min(1),

  CLIENT_URL: z.string().url(),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment variables:",
    result.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = result.data;