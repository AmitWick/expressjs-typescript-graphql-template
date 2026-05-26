import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export const userResolvers: Resolvers = {
  Query: {
    userById: async (_, arg, ctx) => {
      //   if (!ctx.user) return null;

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: arg.id,
        },
      });
      // const user = await ctx.prisma.user.findFirst({
      //   where: {
      //     id: arg.id,
      //   },
      // });

      return user;
    },
    users: async (parent, arg, ctx) => {
      const allUsers = await ctx.prisma.user.findMany();
      return allUsers;
    },
  },
  User: {
    posts: async (parent, arg, ctx) => {
      // const userPosts = await ctx.prisma.post.findMany({
      //   where: {
      //     userId: parent.id,
      //   },
      // });

      return ctx.loaders.postsByUserIdLoader.load(parent.id);
    },
  },
  Mutation: {
    createUser: async (_, arg, ctx) => {
      // it will throw error if parse is not correct
      const validated = createUserSchema.parse(arg.input);

      const newUser = await ctx.prisma.user.create({
        data: validated,
      });

      return newUser;
    },
  },
};
