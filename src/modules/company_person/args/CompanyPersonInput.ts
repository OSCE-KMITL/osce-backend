import { Field, InputType } from 'type-graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CompanyPersonInput {
    @IsEmail()
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    password!: string;

    @Field({ nullable: false })
    full_name!: string;

    @Field({ nullable: false })
    job_title!: string;

    @Field({ nullable: false })
    phone_number!: string;

    @Field({ nullable: false })
    is_coordinator!: Boolean;

    @Field({ nullable: false })
    company_id!: string;
}
@InputType()
export class CompanyPersonWithCompanyNameInput {
    @IsEmail()
    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    full_name!: string;

    @Field({ nullable: false })
    job_title!: string;

    @Field({ nullable: false })
    phone_number!: string;

    @Field({ nullable: false })
    is_coordinator!: Boolean;

    @Field({ nullable: false })
    company_name!: string;
}

@InputType()
export class UpdateCompanyPersonInput {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: false })
    full_name!: string;

    @Field({ nullable: false })
    job_title!: string;

    @Field({ nullable: false })
    email!: string;

    @Field({ nullable: false })
    phone_number!: string;

    @Field({ nullable: false })
    is_coordinator!: Boolean;
}
