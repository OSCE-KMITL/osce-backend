import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCompanyAssessmentInput {
    @Field()
    company_id!: string;

    @Field()
    student_id!: string;

    @Field(() => GraphQLJSONObject)
    assessment_obj!: object;

    @Field()
    score!: number;

    @Field({ nullable: true })
    strength: string;

    @Field({ nullable: true })
    improvement: string;
}
