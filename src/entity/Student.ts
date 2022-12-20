import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
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

    constructor(student_id: string, name: string, lastname: string) {
        this.student_id = student_id;
        this.name = name;
        this.lastname = lastname;
    }
}
