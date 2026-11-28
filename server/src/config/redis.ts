
import { Redis } from "ioredis";
import { env } from "./env.js";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!env.REDIS_ENABLED) {
    return null;
  }

  if (!env.REDIS_URL) {
    return null;
  }

  if (redis) {
    return redis;
  }

  redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,

    connectTimeout: 5000,
    commandTimeout: 2000,

    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,

    retryStrategy(times) {
      return Math.min(times * 200, 3000);
    },
  });

  redis.on("ready", () => {
    console.log("Redis connected successfully");
  });

  redis.on("error", () => {
    console.warn("Redis connection unavailable");
  });

  redis.on("reconnecting", () => {
    console.warn("Redis reconnecting...");
  });

  return redis;
}

export async function connectRedis(): Promise<boolean> {
  const client = getRedis();

  if (!client) {
    return false;
  }

  try {
    if (client.status === "wait") {
      await client.connect();
    }

    if (client.status !== "ready") {
      return false;
    }

    const response = await client.ping();

    return response === "PONG";
  } catch {
    console.warn("Redis startup check failed");

    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (!redis) return;

  try {
    if (redis.status === "ready") {
      await redis.quit();
    } else {
      redis.disconnect();
    }
  } catch {
    redis.disconnect();
  } finally {
    redis = null;
  }
}
