import { Field, InputType } from 'type-graphql';

@InputType()
export class EditJobStateInput {
    @Field({ nullable: false })
    student_apply_job_id!: string;
}
