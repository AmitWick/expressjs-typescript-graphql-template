import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";

const createPostSchema = z.object({
  title: z.string().min(2),
  comment: z.string().min(2),
});

export const postResolvers: Resolvers = {
  Mutation: {
    createPost: async (__, arg, ctx) => {
      const validated = createPostSchema.parse(arg.input);

      const newPost = await ctx.prisma.post.create({
        data: {
          title: validated.title,
          comment: validated.comment,
          userId: "cmpl2i2ep00021kol49v4c3w7",
        },
      });

      return newPost;
    },
  },
  Query: {
    postById: async (parent, arg, ctx) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: arg.id,
        },
      });
      return post;
    },
    posts: async (parent, arg, ctx) => {
      const allPosts = await ctx.prisma.post.findMany();
      return allPosts;
    },
  },
  Post: {
    user: async (parent, arg, ctx) => {
      return ctx.loaders.userLoader.load(parent.userId);
    },
  },
};
