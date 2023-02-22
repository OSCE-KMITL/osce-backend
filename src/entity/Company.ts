import { Job } from './Job';
import { CompanyPerson } from './CompanyPerson';
import { Field, ObjectType } from 'type-graphql';
import { v4 as uuid } from 'uuid';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Company {
    @PrimaryColumn()
    @Field()
    id: string = uuid();

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    name_th: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    name_eng: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    address: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    sub_district: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    district: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    province: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    postal_code: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    phone_number: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    website_url: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    business_type: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @Field(() => [CompanyPerson], { nullable: 'items' })
    @OneToMany(() => CompanyPerson, (company_person) => company_person.company_id, { cascade: true, onDelete: 'CASCADE', eager: true })
    company_persons: CompanyPerson[];

    @Field(() => [Job], { nullable: 'items' })
    @OneToMany(() => Job, (job) => job.company_id, { cascade: true, eager: true })
    job: Job[];

    constructor(
        name_th: string,
        name_eng: string,
        address: string,
        sub_district: string,
        district: string,
        province: string,
        postal_code: string,
        phone_number: string,
        website_url: string,
        business_type: string
    ) {
        this.name_th = name_th;
        this.name_eng = name_eng;
        this.address = address;
        this.sub_district = sub_district;
        this.district = district;
        this.province = province;
        this.postal_code = postal_code;
        this.phone_number = phone_number;
        this.website_url = website_url;
        this.business_type = business_type;
        
    }
}
