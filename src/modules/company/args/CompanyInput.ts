import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
@InputType()
export class CompanyInput {
    @Field()
    name: string;

    @Field()
    address: string;

    @Field()
    phone_number: string;
    
    @Field()
    website_url: string;

    @Field()
    business_type: string;
}
@InputType()
export class UpdateCompanyInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    address: string;

    @Field()
    phone_number: string;

    @Field()
    website_url: string;

    @Field()
    business_type: string;
}

