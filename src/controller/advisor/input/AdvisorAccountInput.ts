import { Field, InputType } from "type-graphql";
import { AdvisorAccount } from "../../../entities/AdvisorAccount";
import {IsEmail} from "class-validator";

@InputType()
export class AdvisorAccountInput {
  @IsEmail()
  @Field({nullable:false})
  email!: string;

  @Field({nullable:false})
  password!: string;

  @Field({nullable:false})
  fullName!: string;

  @Field({nullable:false})
  faculty!: string;

}@InputType()
export class UpdateAdvisorInput {
  @Field({nullable:false})
  id!: string;

  @Field({nullable:false})
  fullName!: string;

  @Field({nullable:false})
  faculty!: string;

}