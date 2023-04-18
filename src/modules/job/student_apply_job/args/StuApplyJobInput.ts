import { Field, InputType } from 'type-graphql';

@InputType()
export class EditJobStateInput {
    @Field({ nullable: false })
    student_apply_job_id!: string;
}
@InputType()
export class AssignJobInput {
    @Field({ nullable: false })
    job_id!: string;

    @Field({ nullable: false })
    student_id!: string;
}
