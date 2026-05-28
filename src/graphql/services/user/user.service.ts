import { CACHE_KEYS } from "@/cache/cache.keys.js";
import {
  getCache,
  getManyCache,
  setCache,
  setManyCache,
} from "@/cache/redis.helpers.js";
import { Prisma, User } from "@/generated/prisma/index.js";
import {
  createUser,
  findUserById,
  findUsersByIds,
  findUsersByPage,
} from "./user.db.js";

export const getUserByID = async (id: string): Promise<User | null> => {
  const cacheKey = CACHE_KEYS.USER(id);

  const cached = await getCache<User>(cacheKey);

  if (cached) return cached;

  const user = await findUserById(id);

  if (user) {
    void setCache(cacheKey, user);
  }

  return user;
};

export const getUsersByIDs = async (
  ids: string[],
): Promise<(User | null)[]> => {
  if (ids.length === 0) return [];

  const keys = ids.map((id) => CACHE_KEYS.USER(id));

  const cachedUsers = await getManyCache<User>(keys);

  const missingIds: string[] = [];

  cachedUsers.forEach((user, i) => {
    if (!user) missingIds.push(ids[i]);
  });

  let dbUsers: User[] = [];

  if (missingIds.length > 0) {
    dbUsers = await findUsersByIds(missingIds);

    void setManyCache(CACHE_KEYS.USER_Prefix, dbUsers);
  }

  const userMap = new Map<string, User>();

  cachedUsers.forEach((u) => {
    if (!u) return;
    userMap.set(u.id, u);
  });

  dbUsers.forEach((u) => {
    if (!u) return;
    userMap.set(u.id, u);
  });

  return ids.map((id) => userMap.get(id) || null);
};

export const getUsersByPages = async (page: number, take = 3) => {
  const cacheKey = CACHE_KEYS.USER(`Page:${page.toString()}`);

  const userIds = await getCache<string[]>(cacheKey);

  let cached: (User | null)[] = [];
  if (userIds && userIds.length > 0) {
    const cachedUserIds = userIds.map((id) => CACHE_KEYS.USER(id));
    cached = await getManyCache<User>(cachedUserIds);
  }

  if (cached.length > 0 && cached.some((u) => u)) return cached;

  const users = await findUsersByPage(page, take);

  if (users.length > 0) {
    void setCache(
      cacheKey,
      users.map((u) => u.id),
    );

    void setManyCache(CACHE_KEYS.USER_Prefix, users);
  }

  return users;
};

export const createUserDB = async (data: Prisma.UserCreateInput) => {
  const create = await createUser(data);

  void setCache(CACHE_KEYS.USER(create.id), create);

  return create;
};
