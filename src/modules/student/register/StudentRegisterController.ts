import { AppContext } from './../../../shared/types/context-types';
import { StudentApplyJobInput } from './../args/StudentRegisterInput';
import { Student } from './../../../entity/Student';
import { RoleOption } from './../../../shared/types/Roles';
import { Arg, Mutation, Resolver, UseMiddleware, Ctx } from 'type-graphql';
import { Service } from 'typedi';
import { StudentRegisterService } from './StudentRegisterService';
import { Account } from '../../../entity/Account';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { useAuthorization } from '../../../middleware/useAuthorization';

@Resolver()
@Service()
export class StudentRegisterController {
    constructor(private readonly service: StudentRegisterService) {}

    @Mutation(() => Account)
    async studentRegister(@Arg('student_register_input') input: StudentRegisterInput): Promise<Account> {
        return await this.service.registerStudent(input);
    }

    // @UseMiddleware(useAuthorization([RoleOption.STUDENT]))
    @Mutation(() => Student, { nullable: true })
    async applyJob(@Arg('apply_info') apply_info: StudentApplyJobInput, @Ctx() { req }: AppContext): Promise<Student | null> {
        const { user_id } = req;
        return this.service.applyJob(apply_info, user_id!);
    }
}
