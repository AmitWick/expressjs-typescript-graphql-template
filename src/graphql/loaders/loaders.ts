import { createPostsByUserIdLoader } from "./post.loader.js";
import { createUserLoader } from "./user.loader.js";

export type CreateLoaders = {
  userLoader: ReturnType<typeof import("./user.loader.js").createUserLoader>;
  postsByUserIdLoader: ReturnType<
    typeof import("./post.loader.js").createPostsByUserIdLoader
  >;
};

const createLoaders = () => ({
  userLoader: createUserLoader(),
  postsByUserIdLoader: createPostsByUserIdLoader(),
});

export default createLoaders;
