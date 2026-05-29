import { makeSlidingWindow, SlidingWindowOptions } from "./slidingWindow.js";

const operationsLimit: Record<
  string,
  (keyPrefix: string) => SlidingWindowOptions
> = {
  createUser: (keyPrefix) =>
    makeSlidingWindow(`${keyPrefix}:createUser`, 2, 600),
};

export default operationsLimit;
