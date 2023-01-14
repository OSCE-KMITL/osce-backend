import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
@InputType()
export class JobInput {
    @Field()
    job_title: string;

    @Field()
    required_major: string;

    @Field()
    project_topic: string;

    @Field()
    nature_of_work: string;

    @Field()
    required_skills: string;

    @Field()
    limit: string;

    @Field()
    welfare: string;

    @Field()
    compensation: string;

    @Field()
    coop301_fileurl: string;
}

@InputType()
export class UpdateJobInput {
    @Field()
    id: string;

    @Field()
    job_title: string;

    @Field()
    required_major: string;

    @Field()
    project_topic: string;

    @Field()
    nature_of_work: string;

    @Field()
    required_skills: string;

    @Field()
    limit: string;

    @Field()
    welfare: string;

    @Field()
    compensation: string;

    @Field()
    coop301_fileurl: string;
}
