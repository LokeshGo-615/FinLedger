
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { getRedis } from "../config/redis.js";
import { CacheKeys } from "../utils/cacheKeys.js";

interface LimiterOptions {
  scope: string;
  windowMs: number;
  limit: number;
}

function createLimiter(options: LimiterOptions) {
  const redis = getRedis();

  return rateLimit({
    windowMs: options.windowMs,

    limit: options.limit,
    

    standardHeaders: "draft-7",

    legacyHeaders: false,

    // Optional Redis failure must not silently
    // disable request limiting.
    passOnStoreError: false,
    skip: () => process.env.NODE_ENV === "test",

    ...(redis
      ? {
          store: new RedisStore({
            prefix: CacheKeys.rateLimit(options.scope),

            sendCommand: (...args: string[]) =>
              redis.call(
                args[0]!,
                ...args.slice(1)
              ) as any,
          }),
        }
      : {}),

    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        statusCode: 429,
        message:
          "Too many requests. Please try again later.",
      });
    },
  });
}

export const globalRateLimiter = createLimiter({
  scope: "global",
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

export const authRateLimiter = createLimiter({
  scope: "auth",
  windowMs: 15 * 60 * 1000,
  limit: 20,
});

export const transactionRateLimiter = createLimiter({
  scope: "transactions",
  windowMs: 60 * 1000,
  limit: 30,
});
