import {Field, InputType} from "type-graphql";
@InputType()
export class GetWithKeyInput{
    @Field({nullable:true})
    target:string

    @Field({nullable:true})
    value:string

}