import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
@InputType()
export class CompanyInput {
    @Field()
    name_th: string;

    @Field()
    name_eng: string;

    @Field()
    address: string;

    @Field()
    sub_district: string;

    @Field()
    district: string;

    @Field()
    province: string;

    @Field()
    postal_code: string;

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
    name_th: string;

    @Field()
    name_eng: string;

    @Field()
    address: string;

    @Field()
    sub_district: string;

    @Field()
    district: string;

    @Field()
    province: string;
    
    @Field()
    postal_code: string;

    @Field()
    phone_number: string;

    @Field()
    website_url: string;

    @Field()
    business_type: string;
}
