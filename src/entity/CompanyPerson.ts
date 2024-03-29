import { Company } from './Company';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from './Account';

@Entity()
@ObjectType()
export class CompanyPerson {
    @PrimaryColumn()
    @Field()
    company_person_id: string = uuid();

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    full_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    job_title: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    email: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    phone_number: string;

    @Column({ default: false })
    @Field()
    is_coordinator: Boolean = false;

    @Field(() => Account,{nullable:true})
    @OneToOne(() => Account, (account) => account.is_company, { onDelete: 'CASCADE' ,lazy:true })
    account: Promise<Account>;

    @Field(() => Company, { nullable: true })
    @ManyToOne(() => Company, (company) => company.company_persons, { onDelete: 'CASCADE' ,cascade:true})
    @JoinColumn({ name: 'company_id' })
    company_id: Promise<Company>;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(full_name: string, job_title: string, is_coordinator: Boolean, email: string, phone_number: string) {
        this.full_name = full_name;
        this.job_title = job_title;
        this.is_coordinator = is_coordinator;
        this.email = email;
        this.phone_number = phone_number;
    }
}
