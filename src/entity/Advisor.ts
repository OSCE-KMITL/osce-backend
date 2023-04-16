import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Account } from './Account';
import { Announcement } from './Announcement';
import { Curriculum } from './Curriculum';
import { Department } from './Department';
import { Faculty } from './Faculty';
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


    @Field(() => Faculty, { nullable: true })
    @ManyToOne(() => Faculty, (faculty) => faculty.advisors, { nullable: true, eager: true })
    @JoinColumn({ name: 'faculty' })
    faculty: Faculty;

    @Field(() => Department, { nullable: true })
    @ManyToOne(() => Department, (department) => department.advisors, { nullable: true, eager: true })
    @JoinColumn({ name: 'department' })
    department: Department;

    @Field(() => Curriculum, { nullable: true })
    @ManyToOne(() => Curriculum, (curr) => curr.advisors, { nullable: true, eager: true })
    @JoinColumn({ name: 'curriculum' })
    curriculum: Curriculum;

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

    constructor(name: string, lastname: string, is_committee: Boolean, name_prefix: string) {
        this.name = name;
        this.last_name = lastname;
        this.is_committee = is_committee;
        this.name_prefix = name_prefix;
    }
}
