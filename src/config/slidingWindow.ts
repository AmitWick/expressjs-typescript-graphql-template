import redisClient from "@/config/redis.js";
import { GraphQLError } from "graphql";

export type SlidingWindowOptions = {
  key: string;
  limit: number;
  duration: number; // seconds
};

export const makeSlidingWindow = (
  key: string,
  limit = 100,
  duration = 60,
): SlidingWindowOptions => ({
  key,
  duration,
  limit,
});

const slidingWindow = async ({
  key,
  limit = 100,
  duration = 60,
}: SlidingWindowOptions) => {
  const now = Date.now();

  const windowStart = now - duration * 1000;

  const redisKey = `sw:${key}`;

  // unique request id
  const requestId = `${now}-${Math.random()}`;
  const pipeline = redisClient.multi();

  //     remove timestamps older than window
  // await redisClient.zremrangebyscore(redisKey, 0, windowStart);
  pipeline.zremrangebyscore(redisKey, 0, windowStart);

  //   count current requests
  // const requestCount = await redisClient.zcard(redisKey);
  pipeline.zcard(redisKey);

  const results = await pipeline.exec();

  const requestCount = results?.[1]?.[1] as number;

  if (requestCount >= limit) {
    throw new GraphQLError("Rate limit exceeded", {
      extensions: {
        code: "RATE_LIMIT_EXCEEDED",
      },
    });
  }

  const newPipeline = redisClient.multi();

  //   Add current request
  newPipeline.zadd(redisKey, now, requestId);

  //   set expiration
  newPipeline.expire(redisKey, duration);

  await newPipeline.exec();
};

export default slidingWindow;
