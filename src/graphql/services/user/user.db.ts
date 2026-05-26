import { RedisQuery } from "@/cache/redisQuery.js";
import prisma from "@/config/prisma.js";
import type { User, Prisma } from "@/generated/prisma/client.js";

type CachedUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const userRedisQuery = new RedisQuery<
  User,
  Prisma.UserFindFirstArgs,
  Prisma.UserCreateInput
>({
  prefix: "User",
  async findFirst(filter) {
    return prisma.user.findFirst(filter);
  },
  async findMany(filter) {
    return prisma.user.findMany(filter);
  },
  async createOne({ data }) {
    return prisma.user.create({
      data,
    });
  },
});

/**
 * Cached + DB fallback user fetch (batch)
 */
// export const getUserByIDs = async (
//   userIds: string[],
// ): Promise<(User | null)[]> => {
//   if (!Array.isArray(userIds) || userIds.length === 0) {
//     throw new Error("UserIds must be a non-empty array");
//   }

//   // -----------------------------
//   // 1. Fetch from Redis
//   // -----------------------------
//   const cachedUsers = await Promise.all(
//     userIds.map(async (id) => {
//       const cached = await redisClient.get(`User:${id}`);
//       return cached ? (JSON.parse(cached) as User) : null;
//     }),
//   );

//   // -----------------------------
//   // 2. Find missing IDs
//   // -----------------------------
//   const missingIds: string[] = [];

//   cachedUsers.forEach((user, index) => {
//     if (!user) {
//       missingIds.push(userIds[index]);
//     }
//   });

//   // -----------------------------
//   // 3. Fetch missing from DB
//   // -----------------------------

//   const dbUsers =
//     missingIds.length > 0
//       ? await prisma.user.findMany({
//           where: {
//             id: { in: missingIds },
//           },
//         })
//       : [];

//   // -----------------------------
//   // 4. Validate (strict mode)
//   // -----------------------------
//   const foundIds = new Set(dbUsers.map((u) => u.id));

//   const invalidIds = missingIds.filter((id) => !foundIds.has(id));

//   if (invalidIds.length > 0) {
//     throw new Error(`Users not found: ${invalidIds.join(", ")}`);
//   }

//   // -----------------------------
//   // 5. Cache DB results
//   // -----------------------------
//   await Promise.all(
//     dbUsers.map((user) =>
//       redisClient.set(`User:${user.id}`, JSON.stringify(user), "EX", 3600),
//     ),
//   );

//   // -----------------------------
//   // 6. Merge results into map
//   // -----------------------------
//   const userMap = new Map<string, User>();

//   cachedUsers.forEach((user, index) => {
//     if (user) {
//       userMap.set(user.id, user);
//     }
//   });

//   dbUsers.forEach((user) => {
//     userMap.set(user.id, user);
//   });

//   // -----------------------------
//   // 7. Preserve input order
//   // -----------------------------
//   return userIds.map((id) => userMap.get(id) ?? null);
// };

// export const getUserByID = async (userId: string): Promise<User | null> => {
//   if (!userId) throw new Error("UserId is required");

//   const cached = await redisClient.get(`User:${userId}`);

//   if (cached) {
//     return JSON.parse(cached) as User;
//   }

//   const filter = {
//     where: {
//       id: userId,
//     },
//   };

//   const user = await prisma.user.findUnique(filter);

//   if (user) {
//     await redisClient.set(`User:${user.id}`, JSON.stringify(user), "EX", 3600);
//   }

//   return user;
// };
