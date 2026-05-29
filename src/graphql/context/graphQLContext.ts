import {
  ExpressRequestWithAuth,
  getAuth,
  SessionAuthObject,
} from "@clerk/express";
import type { CreateLoaders } from "../loaders/loaders.js";
import createLoaders from "../loaders/loaders.js";

export interface GraphQLContext {
  user: SessionAuthObject;
  loaders: CreateLoaders;
}

const graphQLContext = (ctx: any): GraphQLContext => {
  const user = getAuth(ctx.req as ExpressRequestWithAuth);

  // if (!user.isAuthenticated)
  //   throw new GraphQLError("User is not authenticated", {
  //     extensions: { code: "USER_NOT_FOUND" },
  //   });

  return {
    user,
    loaders: createLoaders(),
  };
};

export default graphQLContext;
