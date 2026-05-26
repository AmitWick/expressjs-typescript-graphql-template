import type { Request, Response, NextFunction } from "express";

const globalErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.log.error("Global Error Handler");

  res.status(500).json({
    message: "Internal Server Error",
  });
};

export default globalErrorMiddleware;
