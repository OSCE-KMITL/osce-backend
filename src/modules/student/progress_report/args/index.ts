import {Field, InputType} from "type-graphql";
@InputType()
export class ProgressReportInput {
    @Field()
    commute_score: number;

    @Field()
    advisement_score: number;

    @Field()
    work_score: number;

    @Field()
    current_res: string;

    @Field({nullable:true})
    mentor_name: string;

    @Field({nullable:true})
    mentor_lastname: string;

    @Field({nullable:true})
    mentor_position: string;

    @Field()
    other_suggest: string;


}
