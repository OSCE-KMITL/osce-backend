import { graphql, Source } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { GraphqlUtil } from "../graphql/GraphqlUtil";

export interface gqlOptions {
  source: Source | string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

export class TestUtils {
  static async executeGraphQL(options: gqlOptions) {
    const { variableValues, source } = options;
    return graphql({
      schema: await GraphqlUtil.getSchema(),
      source,
      variableValues,
    });
  }
}