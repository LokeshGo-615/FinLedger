import {
  getRedis,
  disconnectRedis,
} from "../config/redis.js";

import { env } from "../config/env.js";

async function main() {
  try {
    console.log("Redis enabled:", env.REDIS_ENABLED);
    console.log("Redis URL configured:", !!env.REDIS_URL);

    const redis = getRedis();

    if (!redis) {
      throw new Error("Redis client unavailable");
    }

    redis.on("error", (error) => {
      console.error("Redis error:", error.message);
    });

    console.log("Redis initial status:", redis.status);

    if (redis.status === "wait") {
      await redis.connect();
    }

    console.log("Redis current status:", redis.status);

    const response = await redis.ping();

    console.log("Redis response:", response);

    if (response !== "PONG") {
      throw new Error("Unexpected Redis response");
    }

    console.log("Redis health check passed");

  } catch (error) {
    console.error("Redis health check failed:", error);
    process.exitCode = 1;

  } finally {
    await disconnectRedis();
  }
}

void main();