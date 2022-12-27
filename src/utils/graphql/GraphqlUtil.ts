import { buildSchema } from 'type-graphql';
import { RegisterAdvisorAccount } from '../../modules/advisor/register-advisor/RegisterAdvisorAccount';
import { Container } from 'typedi';
import { AnnouncementController } from '../../modules/annoucement/AnnouncementController';
import { StudentRegisterController } from '../../modules/student/register/StudentRegisterController';
import { AccountController } from '../../modules/account/AccountController';

export class GraphqlUtil {
    static async getSchema() {
        return await buildSchema({
            resolvers: [RegisterAdvisorAccount, AnnouncementController, StudentRegisterController, AccountController],
            emitSchemaFile: true,
            container: Container,
        });
    }
}
