import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { AccountStatus, RoleOption } from '../../../../shared/types/Roles';

@InputType()
export class AdvisorAccountInput {
    @IsEmail()
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    name!: string;

    @Field({ nullable: false })
    last_name!: string;

    @Field({ nullable: false })
    is_committee!: RoleOption;

    @Field({ nullable: false })
    name_prefix: string;


}

@InputType()
export class UpdateAdvisorArgs {
    @Field({ nullable: false })
    account_id: string;

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
