import prisma from "@/config/prisma.js";
import type { Prisma } from "@prisma/client";

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findUsersByIds = (ids: string[]) => {
  return prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const findUsersByPage = (page: number, take = 10) => {
  const skip = (page - 1) * take;

  return prisma.user.findMany({
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createUser = (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};
