import { Field, InputType } from 'type-graphql';
import { RoleOption } from '../../../shared/types/Roles';

@InputType()
export class StudentRegisterInput {
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    password!: string;

    @Field({ nullable: false })
    student_id!: string;

    @Field({ nullable: false })
    name_eng!: string;

    @Field({ nullable: false })
    lastname_eng!: string;

    role: RoleOption = RoleOption.STUDENT;
}

@InputType()
export class StudentApplyJobInput {
    @Field({ nullable: false })
    job_id: string;
}

@InputType()
export class EditScoreInput {
    @Field()
    score_advisor!: number;

    @Field()
    score_company!: number;

    @Field()
    score_presentation!: number;

    @Field()
    student_id!: string;
}
