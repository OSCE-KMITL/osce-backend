import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
@InputType()
export class AnnouncementInput {
    @Field()
    advisor_id!: string;

    @Field()
    title!: string;

    @Field()
    desc!: string;
}

@InputType()
export class UpdateAnnouncementInput {
    @Field()
    id: string;

    @Field()
    @MaxLength(255)
    title: string;

    @Field()
    @MaxLength(1000)
    desc: string;
}
