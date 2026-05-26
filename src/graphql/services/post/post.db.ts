import { RedisQuery } from "@/cache/redisQuery.js";
import prisma from "@/config/prisma.js";
import type { Post, Prisma } from "@/generated/prisma/client.js";

export const postRedisQuery = new RedisQuery<
  Post,
  Prisma.PostFindFirstArgs,
  Prisma.PostCreateInput
>({
  prefix: "Post",
  findFirst(filter) {
    return prisma.post.findFirst(filter);
  },
  findMany(filter) {
    return prisma.post.findMany(filter);
  },
  createOne({ data }) {
    return prisma.post.create({
      data,
    });
  },
});
