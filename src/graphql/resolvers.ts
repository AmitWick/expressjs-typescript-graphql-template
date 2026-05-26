import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./modules/user/user.resolvers.js";
import { postResolvers } from "./modules/post/post.resolvers.js";
import { DateTimeResolver } from "graphql-scalars";

const scalarResolvers = {
  DateTime: DateTimeResolver,
};

const resolvers = mergeResolvers([
  scalarResolvers,
  userResolvers,
  postResolvers,
]);

export default resolvers;
