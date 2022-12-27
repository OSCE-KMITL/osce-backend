import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { StudentRegisterService } from './StudentRegisterService';
import { Account } from '../../../entity/Account';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { Student } from '../../../entity/Student';

@Resolver()
@Service()
export class StudentRegisterController {
    constructor(private readonly service: StudentRegisterService) {}

    @Mutation(() => Account)
    async studentRegister(@Arg('student_register_input') input: StudentRegisterInput): Promise<Account> {
        return await this.service.registerStudent(input);
    }
    @Query(() => [Student], { nullable: 'items' })
    async getStudents(): Promise<Student[] | undefined> {
        return await this.service.getStudents();
    }
}
