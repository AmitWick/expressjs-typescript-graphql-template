import redisClient from "@/config/redis.js";

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cached = await redisClient.get(key);

  if (!cached) return null;

  return JSON.parse(cached) as T;
};

export const getManyCache = async <T>(
  keys: string[],
): Promise<(T | null)[]> => {
  if (keys.length === 0) return [];

  const cached = await redisClient.mget(...keys);

  return cached.map((item) => (item ? (JSON.parse(item) as T) : null));
};

export const setCache = async (key: string, value: unknown, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), "EX", ttl);
};

export const setManyCache = async <T extends { id: string }>(
  prefix: string,
  data: T[],
  ttl = 3600,
) => {
  if (data.length === 0) return;

  const pipeline = redisClient.pipeline();

  data.forEach((item) => {
    pipeline.set(`${prefix}:${item.id}`, JSON.stringify(item), "EX", ttl);
  });

  await pipeline.exec();
};

export const deleteCache = async (key: string) => {
  await redisClient.del(key);
};
