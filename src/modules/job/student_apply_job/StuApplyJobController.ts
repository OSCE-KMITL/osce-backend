import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { StuApplyJobService } from './StuApplyJobService';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { Upload } from '../../../shared/types/Upload';
import { StudentApplyJobInput } from '../../student/args/StudentRegisterInput';
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');

@Resolver()
@Service()
export class StuApplyJobController {
    constructor(private readonly service: StuApplyJobService) {}

    // @UseMiddleware(useAuthorization([RoleOption.STUDENT]))
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

    @Mutation(() => Student, { nullable: true })
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
}
