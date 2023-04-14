import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from './Account';
import { Announcement } from './Announcement';
import { Student } from './Student';

@Entity()
@ObjectType()
export class Advisor {
    @PrimaryColumn()
    @Field()
    advisor_id: string = uuid();

    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    name: string;

    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    @Field({ nullable: true })
    name_prefix: string;

    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    last_name: string;

    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    faculty: string;

    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
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

    @Field(() => [Student], { nullable: 'items' })
    @OneToMany(() => Student, (student) => student.advisor,{ lazy:true})
    students:Student[];

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(name: string, lastname: string, faculty: string, is_committee: Boolean, name_prefix: string, department: string) {
        this.faculty = faculty;
        this.name = name;
        this.last_name = lastname;
        this.is_committee = is_committee;
        this.name_prefix = name_prefix;
        this.department = department;
    }
}
