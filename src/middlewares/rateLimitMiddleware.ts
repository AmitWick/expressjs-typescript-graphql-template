import operationsLimit from "@/config/operationsLimit.js";
import slidingWindow from "@/config/slidingWindow.js";
import extractOperation from "@/utils/extractOperations.js";
import getIP from "@/utils/getIP.js";
import { ExpressRequestWithAuth, SessionAuthObject } from "@clerk/express";

const rateLimitMiddleware = async ({
  req,
  user,
}: {
  req: ExpressRequestWithAuth;
  user: SessionAuthObject;
}) => {
  // 1st level rate limit

  let ip = getIP(req);

  const userId = user?.userId;

  // IP LIMIT
  await slidingWindow({
    key: `ip:${ip}`,
    limit: 200,
    duration: 60,
  });

  // USER LIMIT
  if (userId) {
    await slidingWindow({
      key: `userId:${userId}`,
      limit: 100,
      duration: 60,
    });
  }

  // 2nd level rate limit - individual operation level
  const query = req.body?.query;
  if (!query) return;

  const fields = extractOperation(query);

  console.log("Fields", fields);

  await Promise.all(
    fields.map(async (field) => {
      const limiter = operationsLimit[field];

      if (limiter) {
        await slidingWindow(limiter(userId || ip));
      }
    }),
  );
};

export default rateLimitMiddleware;
