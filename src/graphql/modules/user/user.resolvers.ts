import { z } from "zod";
import { Resolvers } from "@/codegen/graphql.js";
import {
  createUserDB,
  getUserByID,
  getUsersByIDs,
  getUsersByPages,
} from "@/graphql/services/user/user.service.js";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

const userByPagesSchema = z.object({
  page: z.int().min(1),
});

export const userResolvers: Resolvers = {
  Query: {
    userById: async (_, arg, ctx) => {
      if (!arg.id) throw new Error("User Id is not provided");
      const user = await getUserByID(arg.id);
      return user;
    },
    userByIds: async (parent, arg, ctx) => {
      if (arg.ids.length === 0) throw new Error("IDs is not provided");

      const allUsers = await getUsersByIDs(arg.ids);
      return allUsers;
    },
    userByPages: async (parent, arg, ctx) => {
      const validated = userByPagesSchema.parse(arg);
      const users = await getUsersByPages(validated.page, 10);
      return users;
    },
  },
  User: {
    posts: async (parent, arg, ctx) => {
      return ctx.loaders.postsByUserIdLoader.load(parent.id);
    },
  },
  Mutation: {
    createUser: async (_, arg) => {
      // it will throw error if parse is not correct
      const validated = createUserSchema.parse(arg.input);
      const newUser = await createUserDB(validated);
      return newUser;
    },
  },
};
