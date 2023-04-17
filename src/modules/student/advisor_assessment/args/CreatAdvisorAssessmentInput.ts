import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAdvisorAssessmentInput {
    @Field()
    advisor_id!: string;

    @Field()
    student_id!: string;

    @Field(() => GraphQLJSONObject)
    assessment_obj!: object;

    @Field()
    score!: number;
}
