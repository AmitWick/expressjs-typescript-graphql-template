import DataLoader from "dataloader";
import prisma from "@/config/prisma.js";

export const createUserLoader = () =>
  new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds as string[] },
      },
    });

    // map results back to input order
    const userMap = new Map(users.map((u) => [u.id, u]));

    return userIds.map((id) => userMap.get(id) || null);
  });
