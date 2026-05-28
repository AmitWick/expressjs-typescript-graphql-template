import DataLoader from "dataloader";
import { userRedisQuery } from "../services/user/user.db.js";
import { User } from "@/generated/prisma/index.js";
import { getUsersByIDs } from "../services/user/user.service.js";

export const createUserLoader = () =>
  new DataLoader(async (userIds: readonly string[]) => {
    const users = await getUsersByIDs(userIds as string[]);

    // map results back to input order
    const userMap = new Map<string, User>();

    users.forEach((u) => {
      if (!u) return;
      userMap.set(u.id, u);
    });

    return userIds.map((id) => userMap.get(id) || null);
  });
