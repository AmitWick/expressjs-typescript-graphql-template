import { parse } from "graphql";

function extractOperation(query: string): string[] {
  const ast = parse(query);

  const fields: string[] = [];

  for (const def of ast.definitions) {
    if (def.kind === "OperationDefinition") {
      for (const selection of def.selectionSet.selections) {
        if (selection.kind === "Field") {
          fields.push(selection.name.value);
        }
      }
    }
  }

  return fields;
}

export default extractOperation;
