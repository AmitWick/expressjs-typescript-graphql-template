import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/modules/**/*.graphql",

  generates: {
    "./src/codegen/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        // path will be relative to graphql.ts inside of codegen folder
        contextType: "../graphql/context/graphQLContext.js#GraphQLContext",
      },
    },
  },
};

export default config;
