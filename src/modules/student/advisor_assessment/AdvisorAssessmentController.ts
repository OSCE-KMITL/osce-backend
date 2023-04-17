import { RoleOption } from './../../../shared/types/Roles';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware, Query } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { useAuthorization } from '../../../middleware/useAuthorization';
import { AdvisorAssessmentService } from './AdvisorAssessmentService';
import { AdvisorAssessment } from '../../../entity/AdvisorAssessment';
import { CreateAdvisorAssessmentInput } from './args/CreatAdvisorAssessmentInput';

@Resolver()
@Service()
export class AdvisorAssessmentController {
    constructor(private readonly service: AdvisorAssessmentService) {}

    @Query(() => [AdvisorAssessment], { nullable: 'items' })
    async getAllAdvisorAssessment(): Promise<AdvisorAssessment[] | null> {
        try {
            return this.service.getAllAdvisorAssessment();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    @UseMiddleware(useAuthorization([RoleOption.ADVISOR]))
    @Mutation(() => Student, { nullable: true })
    async createAdvisorAssessment(
        @Arg('advisor_assessment_info') advisor_assessment_info: CreateAdvisorAssessmentInput,
        @Ctx() { req }: AppContext
    ): Promise<Student | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.createAdvisorAssessment(advisor_assessment_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}
