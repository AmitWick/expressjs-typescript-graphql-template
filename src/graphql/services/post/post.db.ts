import prisma from "@/config/prisma.js";
import type { Prisma } from "@/generated/prisma/client.js";

export const findPostById = (id: string) => {
  return prisma.post.findUnique({
    where: { id },
  });
};

export const findPostsByIds = (ids: string[]) => {
  return prisma.post.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const findPostsByUserId = (userId: string, page = 1, take = 10) => {
  return prisma.post.findMany({
    where: {
      userId,
    },
    skip: (page - 1) * take,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findPostsByUserIds = async (userIds: string[]) => {
  const postObj = await prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
    select: {
      id: true,
      posts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return postObj.flatMap((obj) => obj.posts);
};

export const findPostsByPage = (page: number, take = 10) => {
  const skip = (page - 1) * take;

  return prisma.post.findMany({
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createPost = (data: Prisma.PostCreateInput) => {
  return prisma.post.create({
    data,
  });
};
