import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { AccountStatus } from '../../../../shared/types/Roles';

@InputType()
export class AdvisorAccountInput {
    @IsEmail()
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    password!: string;

    @Field({ nullable: false })
    name!: string;

    @Field({ nullable: false })
    last_name!: string;

    @Field({ nullable: false })
    faculty!: string;

    @Field({ nullable: false })
    is_committee!: Boolean;

    @Field({ nullable: false })
    name_prefix: string;

    @Field({ nullable: false })
    department: string;
}

@InputType()
export class UpdateAdvisorArgs {
    @Field({ nullable: false })
    id: string;
    @Field({ nullable: false })
    advisor_status: AccountStatus;
    @Field({ nullable: false })
    is_committee: Boolean;
}

@InputType()
export class UpdateAdvisorInput {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: false })
    name!: string;

    @Field({ nullable: false })
    last_name!: string;

    @Field({ nullable: false })
    faculty!: string;

    @Field({ nullable: false })
    is_committee!: Boolean;
}
