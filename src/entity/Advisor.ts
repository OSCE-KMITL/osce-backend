import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from './Account';
import { Announcement } from './Announcement';
import { AdvisorAssessment } from './AdvisorAssessment';

@Entity()
@ObjectType()
export class Advisor {
    @PrimaryColumn()
    @Field()
    advisor_id: string = uuid();

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    last_name: string;

    @Column()
    @Field()
    faculty: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    department: string;

    @Column({ default: false })
    @Field()
    is_committee: Boolean = false;

    @Field(() => Account)
    @OneToOne(() => Account, (account) => account.is_advisor, { onDelete: 'CASCADE' })
    account: Account;

    @Field(() => [Announcement], { nullable: 'items' })
    @OneToMany(() => Announcement, (announcement) => announcement.advisor_id, { cascade: true, eager: true })
    announcements: Announcement[];

    @Field(() => [AdvisorAssessment], { nullable: 'items' })
    @OneToMany(() => AdvisorAssessment, (advisor_assessment) => advisor_assessment.advisor, { cascade: true, eager: true })
    @JoinColumn({ name: 'advisor_assessment' })
    advisor_assessment: AdvisorAssessment[];

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(name: string, lastname: string, faculty: string, is_committee: Boolean) {
        this.faculty = faculty;
        this.name = name;
        this.last_name = lastname;
        this.is_committee = is_committee;
    }
}
