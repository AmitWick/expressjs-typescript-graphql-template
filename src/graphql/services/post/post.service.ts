import { CACHE_KEYS } from "@/cache/cache.keys.js";
import {
  getCache,
  getManyCache,
  setCache,
  setManyCache,
} from "@/cache/redis.helpers.js";
import { Post, Prisma } from "@prisma/client";
import {
  createPost,
  findPostById,
  findPostsByIds,
  findPostsByUserId,
  findPostsByUserIds,
} from "./post.db.js";

const USER_ID = "UserIDs";

export const getPostByID = async (id: string): Promise<Post | null> => {
  const cacheKey = CACHE_KEYS.POST(id);

  const cached = await getCache<Post>(cacheKey);
  if (cached) return cached;

  const post = await findPostById(id);
  if (post) {
    void setCache(cacheKey, post);
  }
  return post;
};

export const getPostsByIDs = async (
  ids: string[],
): Promise<(Post | null)[]> => {
  if (ids.length === 0) return [];

  const keys = ids.map((id) => CACHE_KEYS.USER(id));

  const cachedPosts = await getManyCache<Post>(keys);

  const missingIds: string[] = [];

  cachedPosts.forEach((user, i) => {
    if (!user) missingIds.push(ids[i]);
  });

  let dbPosts: Post[] = [];

  if (missingIds.length > 0) {
    dbPosts = await findPostsByIds(missingIds);

    void setManyCache(CACHE_KEYS.POST_Prefix, dbPosts);
  }

  const postMap = new Map<string, Post>();

  cachedPosts.forEach((u) => {
    if (!u) return;
    postMap.set(u.id, u);
  });

  dbPosts.forEach((u) => {
    if (!u) return;
    postMap.set(u.id, u);
  });

  return ids.map((id) => postMap.get(id) || null);
};

export const getPostsByUserId = async (
  userId: string,
  page?: number,
  take?: number,
): Promise<(Post | null)[]> => {
  const cacheKey = CACHE_KEYS.POST(`UserId:${userId}`);

  const cache = await getCache<string[]>(cacheKey);

  if (cache && cache.length > 0) {
    const keys = cache.map((c) => CACHE_KEYS.POST(c));
    const postsFromRedis = await getManyCache<Post>(keys);

    const missingIds: string[] = [];

    postsFromRedis.forEach((p, i) => {
      if (!p) missingIds.push(cache[i]);
    });

    const posts = await findPostsByIds(missingIds);

    if (posts.length > 0) {
      void setManyCache(CACHE_KEYS.POST_Prefix, posts);
    }

    return [...postsFromRedis, ...posts];
  }

  const posts = await findPostsByUserId(userId, page, take);

  if (posts.length > 0) {
    void setManyCache(CACHE_KEYS.POST_Prefix, posts);

    const postIds = posts.map((p) => p.id);

    void setCache(cacheKey, postIds);
  }

  return posts;
};

export const getPostsByUserIds = async (userIds: string[]) => {
  if (userIds.length === 0) return [];

  const cachedKeys = userIds.map((userId) =>
    CACHE_KEYS.POST(`${USER_ID}:${userId}`),
  );

  const rawPostIds = await getManyCache<string[]>(cachedKeys);

  if (rawPostIds.length > 0 && rawPostIds.some((r) => r)) {
    const missedUserId: string[] = [];

    rawPostIds.forEach((raw, i) => {
      if (!raw) {
        missedUserId.push(userIds[i]);
      }
    });

    const postIds: string[] = rawPostIds
      .filter((f) => f !== null)
      .flatMap((f) => f);

    // Ones have UserID and PostIds
    const uniquePostIds = [...new Set([...postIds])];

    const postsFromRedis = await getManyCache<Post>(
      uniquePostIds.map((id) => CACHE_KEYS.POST(id)),
    );

    const missingIds: string[] = [];

    postsFromRedis.forEach((p, i) => {
      if (!p) missingIds.push(uniquePostIds[i]);
    });

    const missingPosts = await findPostsByIds(missingIds);
    void setManyCache(CACHE_KEYS.POST_Prefix, missingPosts);

    // now for missed UserId
    const posts = await queryAndCachePostsByUserIds(missedUserId);

    return [...postsFromRedis, ...missingPosts, ...posts];
  }

  const posts = await queryAndCachePostsByUserIds(userIds);
  return posts;
};

const queryAndCachePostsByUserIds = async (
  userIds: string[],
): Promise<(Post | null)[]> => {
  if (userIds.length === 0) return [];

  const posts = await findPostsByUserIds(userIds);

  if (posts.length === 0) return [];

  void setManyCache(CACHE_KEYS.POST_Prefix, posts);

  const postMap = new Map<string, string[]>();

  userIds.forEach((u) => postMap.set(u, []));

  posts.forEach((p) => {
    postMap.get(p.userId)?.push(p.id);
  });

  void Promise.all(
    userIds.map((userId) =>
      setCache(CACHE_KEYS.POST(`${USER_ID}:${userId}`), postMap.get(userId)),
    ),
  );

  return posts;
};

export const createPostDB = async (data: Prisma.PostCreateInput) => {
  const create = await createPost(data);

  void setCache(CACHE_KEYS.POST(create.id), create);

  return create;
};
