import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
@InputType()
export class JobInputByCommittee {
    @Field({ nullable: true })
    job_title: string;

    @Field({ nullable: true })
    required_major: string;

    @Field({ nullable: true })
    project_topic: string;

    @Field({ nullable: true })
    nature_of_work: string;

    @Field({ nullable: true })
    required_skills: string;

    @Field({ nullable: true })
    limit: string;

    @Field({ nullable: true })
    welfare: string;

    @Field({ nullable: true })
    compensation: string;

    @Field({ nullable: true })
    coop301_fileurl: string;

    @Field({ nullable: true })
    company_id: string;
}

@InputType()
export class JobInputByCompany {
    @Field({ nullable: true })
    job_title: string;

    @Field({ nullable: true })
    required_major: string;

    @Field({ nullable: true })
    project_topic: string;

    @Field({ nullable: true })
    nature_of_work: string;

    @Field({ nullable: true })
    required_skills: string;

    @Field({ nullable: true })
    limit: string;

    @Field({ nullable: true })
    welfare: string;

    @Field({ nullable: true })
    compensation: string;

    @Field({ nullable: true })
    coop301_fileurl: string;
}

@InputType()
export class UpdateJobInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    job_title: string;

    @Field({ nullable: true })
    required_major: string;

    @Field({ nullable: true })
    project_topic: string;

    @Field({ nullable: true })
    nature_of_work: string;

    @Field({ nullable: true })
    required_skills: string;

    @Field({ nullable: true })
    limit: string;

    @Field({ nullable: true })
    welfare: string;

    @Field({ nullable: true })
    compensation: string;

    @Field({ nullable: true })
    coop301_fileurl: string;
}
