import { StuApplyJobController } from '../modules/job/student_apply_job/StuApplyJobController';
import { FileUploadController } from '../modules/file_upload/FileUploadController';
import { JobController } from '../modules/job/JobController';
import { CompanyPersonController } from '../modules/company_person/register/CompanyPersonController';
import { CompanyController } from '../modules/company/CompanyController';
import { buildSchema } from 'type-graphql';
import { RegisterAdvisorAccount } from '../modules/advisor/register-advisor/RegisterAdvisorAccount';
import { Container } from 'typedi';
import { AnnouncementController } from '../modules/annoucement/AnnouncementController';
import { StudentRegisterController } from '../modules/student/register/StudentRegisterController';
import { AccountController } from '../modules/account/AccountController';
import { AuthController } from '../modules/auth/AuthController';
import {ProgressReportController} from "../modules/student/progress_report/ProgressReportController";
import { CompanyAssessmentController } from '../modules/student/company_assessment/CompanyAssessmentController';
import { AdvisorAssessmentController } from '../modules/student/advisor_assessment/AdvisorAssessmentController';

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
                JobController,
                FileUploadController,
                ProgressReportController,
                StuApplyJobController,
                CompanyAssessmentController,
                AdvisorAssessmentController,
            ],
            emitSchemaFile: true,
            container: Container,
        });
    }
}
