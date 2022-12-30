import { Company } from './Company';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from './Account';

@Entity()
@ObjectType()
export class CompanyPerson {
    @PrimaryColumn()
    @Field()
    company_person_id: string = uuid();

    @Column()
    @Field()
    full_name: string;

    @Column()
    @Field()
    job_title: string;

    @Column({ default: false })
    @Field()
    is_coordinator: Boolean = false;

    @Field(() => Account)
    @OneToOne(() => Account, (account) => account.is_company, { onDelete: 'CASCADE' })
    account: Account;

    @Field(() => Company)
    @ManyToOne(() => Company, (company) => company.company_id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company_id: Company;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(full_name: string, job_title: string) {
        this.full_name = full_name;
        this.job_title = job_title;
    }
}
