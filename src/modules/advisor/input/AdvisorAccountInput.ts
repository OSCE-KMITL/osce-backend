import {Field, InputType} from "type-graphql";
import {IsEmail} from "class-validator";

@InputType()
export class AdvisorAccountInput {
    @IsEmail()
    @Field({nullable: false})
    email!: string;

    @Field({nullable: false})
    password!: string;

    @Field({nullable: false})
    fullName!: string;

    @Field({nullable: false})
    faculty!: string;
}

@InputType()
export class UpdateAdvisorInput {
    @Field({nullable: true})
    id: string;

    @Field({nullable: true})
    fullName!: string;

    @Field({nullable: true})
    faculty!: string;

    @Field({nullable: true})
    isComittee!: Boolean;


    @Field({nullable: true})
    isAdvisor!: Boolean;

    @Field({nullable: true})
    status: string;
}
