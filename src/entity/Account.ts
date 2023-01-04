import { CompanyPerson } from './CompanyPerson';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import 'reflect-metadata';
import { v4 as uuid } from 'uuid';
import { ERole } from '../shared/types/Roles';
import { Advisor } from './Advisor';
import { Student } from './Student';

@ObjectType()
@Entity()
export class Account {
    @PrimaryColumn()
    @Field()
    id: string = uuid();

    @Column({ unique: true })
    @Field()
    email: string;

    @Column()
    @Field()
    password: string;

    @Column()
    @Field(() => ERole)
    role: ERole;

    @Field(() => Student, { nullable: true })
    @OneToOne(() => Student, (account) => account.account, { cascade: true, eager: true })
    @JoinColumn({ name: 'is_student' })
    is_student: Student;

    @Field(() => Advisor, { nullable: true })
    @OneToOne(() => Advisor, (advisor) => advisor.account, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'is_advisor' })
    is_advisor: Advisor;

    @Field(() => CompanyPerson, { nullable: true })
    @OneToOne(() => CompanyPerson, (company) => company.account, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'is_company' })
    is_company: CompanyPerson;

    @Column({ default: 'active' })
    @JoinColumn()
    @Field()
    status: string = 'active' || 'inactive' || 'banned';

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(email: string, password: string, role: ERole) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
