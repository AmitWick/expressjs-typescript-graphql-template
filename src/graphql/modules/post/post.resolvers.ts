import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";
import { postRedisQuery } from "@/graphql/services/post/post.db.js";

const createPostSchema = z.object({
  title: z.string().min(2),
  comment: z.string().min(2),
});

export const postResolvers: Resolvers = {
  Mutation: {
    createPost: async (__, arg, ctx) => {
      const validated = createPostSchema.parse(arg.input);

      const newPost = await postRedisQuery.set({
        ...validated,
        user: {
          connect: {
            id: "cmpl2i2ep00021kol49v4c3w7",
          },
        },
      });

      return newPost;
    },
  },
  Query: {
    postById: async (parent, arg, ctx) => {
      const post = await postRedisQuery.getFirst(arg.id, {
        where: {
          id: arg.id,
        },
      });
      return post;
    },
    posts: async (parent, arg, ctx) => {
      const allPosts = await postRedisQuery.getMany([], {});
      return allPosts;
    },
  },
  Post: {
    user: async (parent, arg, ctx) => {
      return ctx.loaders.userLoader.load(parent.userId);
    },
  },
};
