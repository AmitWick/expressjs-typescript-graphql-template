import express from "express";
import yoga from "./graphql/yoga.js";
import globalMiddlewares from "./middlewares/globalMiddlewares.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";

const app = express();

globalMiddlewares(app);

app.get("/", (req, res) => {
  res.send("Home Page");
});

// REST API (still supported)
app.get("/health", (req, res) => {
  req.log.info("Everything fine");

  res.json({ status: "ok" });
});

// GraphQL endpoint
app.use("/graphql", yoga);

app.use(globalErrorMiddleware);

export { app };
