import { CompanyPersonController } from '../modules/company_person/register/CompanyPersonController';
import { CompanyController } from '../modules/company/CompanyController';
import { buildSchema } from 'type-graphql';
import { RegisterAdvisorAccount } from '../modules/advisor/register-advisor/RegisterAdvisorAccount';
import { Container } from 'typedi';
import { AnnouncementController } from '../modules/annoucement/AnnouncementController';
import { StudentRegisterController } from '../modules/student/register/StudentRegisterController';
import { AccountController } from '../modules/account/AccountController';
import { AuthController } from '../modules/auth/AuthController';

export class GraphqlUtil {
    static async getSchema() {
        return await buildSchema({
            resolvers: [
                RegisterAdvisorAccount,
                AnnouncementController,
                StudentRegisterController,
                AccountController,
                CompanyController,
                CompanyPersonController,
                AuthController,
            ],
            emitSchemaFile: true,
            container: Container,
        });
    }
}
