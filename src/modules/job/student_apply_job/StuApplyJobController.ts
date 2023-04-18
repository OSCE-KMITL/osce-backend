import { EditJobStateInput, AssignJobInput } from './args/StuApplyJobInput';
import { RoleOption } from './../../../shared/types/Roles';
import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { StuApplyJobService } from './StuApplyJobService';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware, Query } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { StudentApplyJobInput } from '../../student/args/StudentRegisterInput';
import { useAuthorization } from '../../../middleware/useAuthorization';

@Resolver()
@Service()
export class StuApplyJobController {
    constructor(private readonly service: StuApplyJobService) {}

    @Query(() => [StudentApplyJob], { nullable: 'items' })
    async getAllStudentApplyJob(): Promise<StudentApplyJob[] | null> {
        try {
            return this.service.getAllStudentApplyJob();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

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

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async committeeApproveJob(
        @Arg('committee_approve_info') committee_approve_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.committeeApproveJob(committee_approve_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoCommitteeApproveJob(
        @Arg('undo_committee_approve_info') undo_committee_approve_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoCommitteeApproveJob(undo_committee_approve_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async committeeDisapproveJob(
        @Arg('committee_disapprove_info') committee_disapprove_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.committeeDisapprove(committee_disapprove_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoCommitteeDisapproveJob(
        @Arg('undo_committee_disapprove_info') undo_committee_disapprove_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoCommitteeDisapprove(undo_committee_disapprove_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async committeeAssignJob(
        @Arg('committee_assignjob_info') committee_assignjob_info: AssignJobInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.committeeAssignJob(committee_assignjob_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.STUDENT, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async studentAcceptJob(@Arg('student_accept_info') student_accept_info: EditJobStateInput, @Ctx() { req }: AppContext): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.studentAcceptJob(student_accept_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.STUDENT, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoStudentAcceptJob(
        @Arg('undo_student_accept_info') undo_student_accept_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoStudentAcceptJob(undo_student_accept_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.STUDENT, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async studentRejectJob(@Arg('student_reject_info') student_reject_info: EditJobStateInput, @Ctx() { req }: AppContext): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.studentRejectJob(student_reject_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @UseMiddleware(useAuthorization([RoleOption.STUDENT, RoleOption.COMMITTEE]))
    @Mutation(() => StudentApplyJob, { nullable: true })
    async undoStudentRejectJob(
        @Arg('undo_student_reject_info') undo_student_reject_info: EditJobStateInput,
        @Ctx() { req }: AppContext
    ): Promise<StudentApplyJob | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.service.undoStudentRejectJob(undo_student_reject_info, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
