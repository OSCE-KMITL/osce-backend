import { Job } from './Job';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany, OneToOne, PrimaryColumn, JoinColumn, JoinTable } from 'typeorm';
import { Account } from './Account';

@Entity()
@ObjectType()
export class Student {
    @PrimaryColumn()
    @Field()
    student_id: string;

    @Column({ charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', name: 'name' })
    @Field()
    name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    lastname: string;

    @Field(() => Account)
    @OneToOne(() => Account, (account) => account.is_student)
    account: Account;

    @Field(() => [Job], { nullable: 'items' })
    @ManyToMany(() => Job,(job) => job.students, { nullable: true, lazy: true })
    @JoinTable({
        name: 'apply_job',
        joinColumn: {
            name: 'student',
            referencedColumnName: 'student_id',
        },
        inverseJoinColumn: {
            name: 'job',
            referencedColumnName: 'id',
        },
    })
    job: Job[];

    constructor(student_id: string, name: string, lastname: string) {
        this.student_id = student_id;
        this.name = name;
        this.lastname = lastname;
    }
}
