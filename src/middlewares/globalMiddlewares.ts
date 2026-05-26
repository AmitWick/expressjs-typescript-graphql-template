import type { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import compression from "compression";
import express from "express";
import environment from "@/utils/environment.js";
import { clerkMiddleware } from "@clerk/express";

const globalMiddlewares = (app: Express) => {
  const pino = pinoHttp.default({
    transport: {
      target: "pino-pretty",
    },
  });

  const isDev = environment.NODE_ENV !== "production";

  app.use(
    helmet({
      contentSecurityPolicy: isDev ? false : undefined,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded());

  app.disable("x-powered-by");

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        environment.CLIENT_URL,
      ],
      credentials: true,
    }),
  );

  // app.use(pino);
  app.use(compression());

  app.use(clerkMiddleware());
};

export default globalMiddlewares;
