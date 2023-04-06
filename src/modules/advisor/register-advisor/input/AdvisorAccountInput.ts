import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';

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
