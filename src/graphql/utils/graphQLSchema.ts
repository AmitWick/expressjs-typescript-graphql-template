import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { createSchema } from "graphql-yoga";
import resolvers from "./resolvers.js";

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(process.cwd(), "src/graphql/modules/**/*.graphql")),
);

const graphQLSchema = createSchema({
  typeDefs,
  resolvers,
});

export default graphQLSchema;
