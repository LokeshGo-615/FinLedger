
import { Redis } from "ioredis";
import { randomUUID } from "node:crypto";

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";

const testUrl = process.env.REDIS_TEST_URL;

const describeRedis = testUrl
  ? describe
  : describe.skip;

describeRedis("FinLedger Redis Integration Tests", () => {
  let redis: Redis;

  const prefix = `finledger:test:${randomUUID()}`;

  const keys = new Set<string>();

  function key(name: string) {
    const value = `${prefix}:${name}`;

    keys.add(value);

    return value;
  }

  beforeAll(async () => {
    if (!testUrl) {
      throw new Error("Missing Redis test URL");
    }

    redis = new Redis(testUrl, {
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 2000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    });

    await redis.connect();
  });

  afterAll(async () => {
    if (!redis) return;

    try {
      if (redis.status === "ready") {
        if (keys.size > 0) {
          await redis.del(...keys);
        }

        await redis.quit();
      }
    } finally {
      redis.disconnect();
    }
  });

  it("connects to Redis successfully", async () => {
    expect(await redis.ping()).toBe("PONG");
  });

  it("stores and retrieves a value", async () => {
    const cacheKey = key("basic");

    await redis.set(cacheKey, "FinLedger", "EX", 60);

    expect(await redis.get(cacheKey))
      .toBe("FinLedger");
  });

  it("stores and retrieves JSON data", async () => {
    const cacheKey = key("json");

    const data = {
      accountType: "SAVINGS",
      currency: "INR",
    };

    await redis.set(
      cacheKey,
      JSON.stringify(data),
      "EX",
      60
    );

    const result = await redis.get(cacheKey);

    expect(JSON.parse(result!)).toEqual(data);
  });

  it("returns null for a cache miss", async () => {
    expect(await redis.get(key("missing")))
      .toBeNull();
  });

  it("assigns a cache expiration time", async () => {
    const cacheKey = key("ttl");

    await redis.set(cacheKey, "value", "EX", 60);

    const ttl = await redis.ttl(cacheKey);

    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(60);
  });

  it("automatically expires cached data", async () => {
    const cacheKey = key("expiration");

    await redis.set(cacheKey, "value", "PX", 200);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });

    expect(await redis.get(cacheKey)).toBeNull();
  });

  it("invalidates cached data", async () => {
    const cacheKey = key("invalidation");

    await redis.set(cacheKey, "value", "EX", 60);

    await redis.del(cacheKey);

    expect(await redis.get(cacheKey)).toBeNull();
  });

  it("supports atomic request counters", async () => {
    const cacheKey = key("counter");

    await Promise.all(
      Array.from({ length: 10 }, () =>
        redis.incr(cacheKey)
      )
    );

    expect(await redis.get(cacheKey)).toBe("10");
  });

  it("isolates cache keys between users", async () => {
    const userA = key("user:A");
    const userB = key("user:B");

    await redis.set(userA, "A", "EX", 60);
    await redis.set(userB, "B", "EX", 60);

    expect(await redis.get(userA)).toBe("A");
    expect(await redis.get(userB)).toBe("B");
  });

  it("supports cache replacement", async () => {
    const cacheKey = key("replacement");

    await redis.set(cacheKey, "old", "EX", 60);
    await redis.set(cacheKey, "new", "EX", 60);

    expect(await redis.get(cacheKey)).toBe("new");
  });
});

