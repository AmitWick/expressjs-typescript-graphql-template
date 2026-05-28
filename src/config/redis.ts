import environment from "@/utils/environment.js";
import Redis from "ioredis";

const redisClient = new Redis.default(environment.REDIS_URL);

// console.log("Redis Client", redisClient);

export default redisClient;
