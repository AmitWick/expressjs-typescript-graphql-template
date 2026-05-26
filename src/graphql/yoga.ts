// src/graphql/yoga.ts
import { createYoga } from "graphql-yoga";
import graphQLSchema from "./graphQLSchema.js";
import environment from "../utils/environment.js";
import { costLimitPlugin } from "@escape.tech/graphql-armor-cost-limit";
import { maxTokensPlugin } from "@escape.tech/graphql-armor-max-tokens";
import { maxDepthPlugin } from "@escape.tech/graphql-armor-max-depth";
import { maxDirectivesPlugin } from "@escape.tech/graphql-armor-max-directives";
import { maxAliasesPlugin } from "@escape.tech/graphql-armor-max-aliases";
import graphQLContext from "./graphQLContext.js";
import { useDisableIntrospection } from "@graphql-yoga/plugin-disable-introspection";

const yoga = createYoga({
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      environment.CLIENT_URL,
    ],
    credentials: true,
    methods: ["POST"],
  },
  schema: graphQLSchema,
  maskedErrors: {
    isDev: environment.NODE_ENV !== "production",
  },
  context: graphQLContext,
  plugins: [
    costLimitPlugin(),
    maxTokensPlugin(),
    maxDepthPlugin(),
    maxDirectivesPlugin(),
    maxAliasesPlugin(),
    useDisableIntrospection({
      isDisabled: (request) => {
        if (environment.NODE_ENV === "development") {
          return false;
        }

        return (
          request.headers.get("x-allow-introspection") !==
          environment.INTROSPECTION_SECRET
        );
      },
    }),
  ],
});

export default yoga;
