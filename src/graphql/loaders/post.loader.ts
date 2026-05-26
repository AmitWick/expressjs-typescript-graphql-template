import DataLoader from "dataloader";
import { postRedisQuery } from "../services/post/post.db.js";

export const createPostsByUserIdLoader = () =>
  new DataLoader(async (userIds: readonly string[]) => {
    const posts = await postRedisQuery.getMany(userIds as string[], {
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
      if (!post) continue;
      postsMap.get(post.userId)?.push(post);
    }

    // Return posts in same order as userIds
    return userIds.map((id) => postsMap.get(id) || []);
  });
