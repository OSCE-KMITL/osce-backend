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
    name!: string;

    @Field({ nullable: false })
    lastname!: string;

    role: RoleOption = RoleOption.STUDENT;
}
