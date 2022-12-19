import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { StudentRegisterService } from './StudentRegisterService';
import { Account } from '../../../entity/Account';
import { ERole } from '../../../shared/types/Roles';

@InputType()
export class RegisterInput {
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    password!: string;

    @Field({ nullable: false })
    student_id!: string;

    @Field({ nullable: false })
    name!: string;

    @Field({ nullable: false })
    lastname!: string;

    role: ERole = ERole.STUDENT;
}
@Resolver()
@Service()
export class StudentRegisterController {
    constructor(private readonly service: StudentRegisterService) {}

    @Mutation(() => Account)
    async studentRegister(@Arg('student_register_input') input: RegisterInput): Promise<Account> {
        return await this.service.registerStudent(input);
    }

    @Query(() => [Account], { nullable: 'items' })
    async getStudents(): Promise<Account[] | null> {
        return await this.service.getStudents();
    }
}
