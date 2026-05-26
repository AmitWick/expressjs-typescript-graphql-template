import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";
import { userRedisQuery } from "@/graphql/services/user/user.db.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export const userResolvers: Resolvers = {
  Query: {
    userById: async (_, arg, ctx) => {
      //   if (!ctx.user) return null;

      const user = await userRedisQuery.getFirst(arg.id, {
        where: {
          id: arg.id,
        },
      });

      return user;
    },
    users: async (parent, arg, ctx) => {
      const allUsers = await userRedisQuery.getMany([], {});
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
    createUser: async (_, arg) => {
      // it will throw error if parse is not correct
      const validated = createUserSchema.parse(arg.input);
      const newUser = await userRedisQuery.set(validated);
      return newUser;
    },
  },
};
