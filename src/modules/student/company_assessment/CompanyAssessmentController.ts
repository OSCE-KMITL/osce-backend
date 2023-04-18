import { RoleOption } from './../../../shared/types/Roles';
import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware, Query } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { StudentApplyJobInput } from '../../student/args/StudentRegisterInput';
import { useAuthorization } from '../../../middleware/useAuthorization';
import { CompanyAssessmentService } from './CompanyAssessmentService';
import { CompanyAssessment } from '../../../entity/CompanyAssessment';
import { CreateCompanyAssessmentInput } from './args/CompanyAssessmentInput';

@Resolver()
@Service()
export class CompanyAssessmentController {
    constructor(private readonly service: CompanyAssessmentService) {}

    @Query(() => [CompanyAssessment], { nullable: 'items' })
    async getAllCompanyAssessment(): Promise<CompanyAssessment[] | null> {
        try {
            return this.service.getAllCompanyAssessment();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    @UseMiddleware(useAuthorization([RoleOption.COMPANY]))
    @Mutation(() => Student, { nullable: true })
    async createCompanyAssessment(
        @Arg('company_assessment_info') company_assessment_info: CreateCompanyAssessmentInput,
        @Ctx() { req }: AppContext
    ): Promise<Student | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.createCompanyAssessment(company_assessment_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // @UseMiddleware(useAuthorization([RoleOption.STUDENT]))
    // @Mutation(() => Student, { nullable: true })
    // async applyJob(@Arg('apply_info') apply_info: StudentApplyJobInput, @Ctx() { req }: AppContext): Promise<Student | null> {
    //     try {
    //         const { user_id } = req;
    //         if (!user_id) {
    //             throw new Error('เข้าสู่ระบบก่อนทำรายการ');
    //         }
    //         return this.service.applyJob(apply_info, user_id);
    //     } catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // }
}
