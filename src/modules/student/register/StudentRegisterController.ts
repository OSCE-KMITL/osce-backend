import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AppContext } from '../../../shared/types/context-types';
import { StudentApplyJobInput } from '../args/StudentRegisterInput';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { StudentRegisterService } from './StudentRegisterService';
import { Account } from '../../../entity/Account';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { CommitteeCoopRegisterArgs, CoopRegisterArgs, LanguageAbilities, SkillsArgs } from '../interfaces';
import { Upload } from '../../../shared/types/Upload';
import { CoopStatus } from '../../../shared/types/CoopStatus';
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');

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

    @Mutation(() => Student, { nullable: true })
    async studentDeleteById(@Arg('student_id') student_id: string, @Ctx() { req }: AppContext): Promise<Student | null | undefined> {
        const { user_id } = req;
        return this.service.deleteStudent(student_id);
    }

    @Query(() => [Student], { nullable: 'items' })
    async getStudents(): Promise<Student[] | undefined> {
        return await this.service.getStudents();
    }
    @Query(() => [Student], { nullable: 'items' })
    async getStudentsApply(): Promise<Student[] | undefined> {
        return await this.service.getStudentsApply();
    }

    @Query(() => [Student], { nullable: true })
    async getStudentsByDepartment(@Arg('department_id') department_id: string): Promise<Student[] | null> {
        return await this.service.getStudentsByDepartment(department_id);
    }

    @Query(() => Student, { nullable: true })
    async getStudent(@Arg('student_id') student_id: string): Promise<Student | null> {
        return await this.service.getStudent(student_id);
    }

    @Mutation(() => Student, { nullable: true })
    async studentRegisterCoop(
        @Arg('register_coop_input') payload: CoopRegisterArgs,
        @Args() { skills }: SkillsArgs,
        @Args() { language_abilities }: LanguageAbilities,
        @Arg('transcript_file', () => GraphQLUpload, { nullable: true }) transcript_file: Upload,
        @Ctx() { req }: AppContext
    ): Promise<any> {
        try {
            const { user_id } = req;
            //console.log(payload);
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return await this.service.registerCoop(payload, user_id, skills, language_abilities, transcript_file);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @Mutation(() => Student)
    async committeeChangeCoopStatus(
        @Arg('student_id') student_id: string,
        @Arg('status') status: CoopStatus,
        @Ctx() { req }: AppContext
    ): Promise<Student | undefined> {
        try {
            return await this.service.committeeChangeCoopStatus(student_id, status);
        } catch (error) {
            console.log(error);

            throw error;
        }
    }

    @Mutation(() => Student, { nullable: true })
    async committeeAddRegisterStudent(@Arg('committee_register_coop_input') payload: CommitteeCoopRegisterArgs, @Ctx() { req }: AppContext): Promise<any> {
        try {
            const { user_id } = req;

            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return await this.service.committeeAddRegisterStudent(payload, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
