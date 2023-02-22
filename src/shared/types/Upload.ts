import { InputType, Field } from 'type-graphql';
import { Stream } from 'stream';

export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}
@InputType()
export class UploadInput {
    @Field({ nullable: true })
    filename: string;

    @Field({ nullable: true })
    mimetype: string;

    @Field({ nullable: true })
    encoding: string;
}
