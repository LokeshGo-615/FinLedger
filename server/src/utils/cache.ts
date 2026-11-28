
import { getRedis } from "../config/redis.js";

export async function getCache<T>(
  key: string
): Promise<T | null> {
  const redis = getRedis();

  if (!redis || redis.status !== "ready") {
    return null;
  }

  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 60
): Promise<boolean> {
  const redis = getRedis();

  if (!redis || redis.status !== "ready") {
    return false;
  }

  if (!Number.isInteger(ttl) || ttl <= 0) {
    return false;
  }

  try {
    await redis.set(
      key,
      JSON.stringify(value),
      "EX",
      ttl
    );

    return true;
  } catch {
    return false;
  }
}

export async function deleteCache(
  ...keys: string[]
): Promise<boolean> {
  const redis = getRedis();

  if (!redis || redis.status !== "ready") {
    return false;
  }

  if (keys.length === 0) {
    return true;
  }

  try {
    await redis.del(...keys);

    return true;
  } catch {
    return false;
  }
}

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  const cached = await getCache<T>(key);

  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();

  if (data !== null && data !== undefined) {
    await setCache(key, data, ttl);
  }

  return data;
}
