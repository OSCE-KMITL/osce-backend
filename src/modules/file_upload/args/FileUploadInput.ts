import { Field, InputType } from 'type-graphql';

@InputType()
export class FileUploadInput {
    @Field({ nullable: true })
    original_name: string;

    @Field({ nullable: true })
    current_name: string;

    @Field({ nullable: true })
    url: string;
}
