import DataLoader from "dataloader";
import prisma from "@/config/prisma.js";

export const createPostsByUserIdLoader = () =>
  new DataLoader(async (userIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        userId: { in: userIds as string[] },
      },
    });

    // Group posts by userId
    const postsMap = new Map<string, typeof posts>();

    for (const userId of userIds) {
      postsMap.set(userId, []);
    }

    for (const post of posts) {
      postsMap.get(post.userId)?.push(post);
    }

    // Return posts in same order as userIds
    return userIds.map((id) => postsMap.get(id) || []);
  });
