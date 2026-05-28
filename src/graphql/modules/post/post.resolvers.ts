import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";
import {
  createPostDB,
  getPostByID,
  getPostsByIDs,
  getPostsByUserId,
} from "@/graphql/services/post/post.service.js";

const createPostSchema = z.object({
  title: z.string().min(2),
  comment: z.string().min(2),
});

const postsByUserIdSchema = z.object({
  id: z.string().min(2),
  page: z.int().min(1),
});

export const postResolvers: Resolvers = {
  Mutation: {
    createPost: async (__, arg, ctx) => {
      const validated = createPostSchema.parse(arg.input);

      const newPost = await createPostDB({
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
      if (!arg.id) throw new Error("Post Id is not provided");
      const post = await getPostByID(arg.id);
      return post;
    },
    postByIds: async (parent, arg, ctx) => {
      if (arg.ids.length === 0) throw new Error("Ids is not provided");

      const allPosts = await getPostsByIDs(arg.ids);
      return allPosts;
    },
    postsByUserId: async (parent, arg, ctx) => {
      const validated = postsByUserIdSchema.parse(arg);
      return getPostsByUserId(validated.id, validated.page);
    },
  },
  Post: {
    user: async (parent, arg, ctx) => {
      return ctx.loaders.userLoader.load(parent.userId);
    },
  },
};
