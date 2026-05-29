// import { RateLimiterRedis } from "rate-limiter-flexible";
// import redisClient from "./redis.js";

// const cache = new Map<string, RateLimiterRedis>();

// const rateLimit = (
//   prefix: string,
//   limit = 100,
//   duration = 60,
// ): RateLimiterRedis => {
//   if (!cache.has(prefix)) {
//     cache.set(
//       prefix,
//       new RateLimiterRedis({
//         storeClient: redisClient,
//         keyPrefix: `rl_${prefix}`,
//         points: limit, // 100 requests
//         duration, // 60 seconds
//       }),
//     );
//   }

//   return cache.get(prefix) as RateLimiterRedis;
// };

// export default rateLimit;
