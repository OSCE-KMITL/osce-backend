import { buildSchema } from "type-graphql";
import { AdvisorAccountController } from "../../modules/advisor/AdvisorAccountController";
import { Container } from "typedi";
import {AnnouncementController} from "../../modules/annoucement/AnnouncementController";

export class GraphqlUtil {
  static async getSchema() {
    return await buildSchema({
      resolvers: [AdvisorAccountController,AnnouncementController],
      emitSchemaFile: { path: "/src/graphql/" },
      container: Container,
    });
  }
}