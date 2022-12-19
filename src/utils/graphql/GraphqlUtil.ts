import { buildSchema } from 'type-graphql';
import { AdvisorAccountController } from '../../modules/advisor/account/AdvisorAccountController';
import { Container } from 'typedi';
import { AnnouncementController } from '../../modules/annoucement/AnnouncementController';
import { StudentRegisterController } from '../../modules/student/register/StudentRegisterController';

export class GraphqlUtil {
    static async getSchema() {
        return await buildSchema({
            resolvers: [AdvisorAccountController, AnnouncementController, StudentRegisterController],
            emitSchemaFile: { path: '/src/graphql/' },
            container: Container,
        });
    }
}
