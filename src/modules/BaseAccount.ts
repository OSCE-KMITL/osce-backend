import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import 'reflect-metadata';
import { v4 as uuid } from 'uuid';

@ObjectType()
export class BaseAccount {
    @PrimaryColumn()
    @Field()
    id: string = uuid();

    @Column({ unique: true })
    @Field()
    private email: string;

    @Column()
    @Field()
    private password: string;

    @Column({ default: false, name: 'is_committee' })
    @Field()
    isComittee: Boolean = false;

    @Column({ default: false, name: 'is_student' })
    @Field()
    isStudent: Boolean = false;

    @Column({ default: false, name: 'is_company' })
    @Field()
    isCompany: Boolean = false;

    @Column({ default: false, name: 'is_advisor' })
    @Field()
    isAdvisor: Boolean = false;

    @Column()
    @Field()
    status: string = 'active';

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'updated_at',
    })
    private updatedAt!: Date;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
