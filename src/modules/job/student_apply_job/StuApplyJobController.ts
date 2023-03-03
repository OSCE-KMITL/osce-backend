import { EditJobStateInput } from './args/StuApplyJobInput';
import { RoleOption } from './../../../shared/types/Roles';
import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { StuApplyJobService } from './StuApplyJobService';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { StudentApplyJobInput } from '../../student/args/StudentRegisterInput';
import { useAuthorization } from '../../../middleware/useAuthorization';

@Resolver()
@Service()
export class StuApplyJobController {
    constructor(private readonly service: StuApplyJobService) {}

    @UseMiddleware(useAuthorization([RoleOption.STUDENT]))
    @Mutation(() => Student, { nullable: true })
    async applyJob(@Arg('apply_info') apply_info: StudentApplyJobInput, @Ctx() { req }: AppContext): Promise<Student | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.applyJob(apply_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.STUDENT]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async cancelApply(@Arg('cancel_apply_info') cancel_apply_info: StudentApplyJobInput, @Ctx() { req }: AppContext): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.cancelApply(cancel_apply_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMPANY, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async companyApproveJob(@Arg('company_approve_info') company_approve_info: EditJobStateInput, @Ctx() { req }: AppContext): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.companyApprove(company_approve_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMPANY, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoCompanyApproveJob(
        @Arg('undo_company_approve_info') undo_company_approve_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoCompanyApprove(undo_company_approve_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMPANY, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async companyDisapproveJob(
        @Arg('company_disapprove_info') company_disapprove_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.companyDisapprove(company_disapprove_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMPANY, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoCompanyDisapproveJob(
        @Arg('undo_company_disapprove_info') undo_company_disapprove_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoCompanyDisapprove(undo_company_disapprove_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
