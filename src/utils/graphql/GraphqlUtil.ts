import { buildSchema } from "type-graphql";
import { AdvisorAccountController } from "../../modules/advisor/AdvisorAccountController";
import { Container } from "typedi";

export class GraphqlUtil {
  static async getSchema() {
    return await buildSchema({
      resolvers: [AdvisorAccountController],
      emitSchemaFile: { path: "/src/graphql/" },
      container: Container,
    });
  }
}