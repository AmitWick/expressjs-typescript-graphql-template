import DataLoader from "dataloader";
import { getPostsByUserIds } from "../services/post/post.service.js";

export const createPostsByUserIdLoader = () =>
  new DataLoader(async (userIds: readonly string[]) => {
    const posts = await getPostsByUserIds(userIds as string[]);

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
    const results = userIds.map((id) => postsMap.get(id) || []);

    return results;
  });
