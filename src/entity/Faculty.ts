import { Field, ID, ObjectType } from 'type-graphql';
import {
    Column,
    Entity,
    PrimaryColumn,
    OneToMany,
} from 'typeorm';
import 'reflect-metadata';

import { Student } from './Student';
import { StudentFacultyRepository } from '../modules/student/register/StudentRegisterRepository';
import { Service } from 'typedi';
import { Advisor } from './Advisor';

@Service()
@Entity()
@ObjectType()
export class Faculty {


    @Field(() => ID)
    @PrimaryColumn()
    faculty_id: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    faculty_name_en: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    faculty_name_th: string;

    @Field(() => [Student], { nullable: 'items' })
    @OneToMany(() => Student, student => student.faculty, { cascade: true })
    students: Promise<Student[]>;

    @Field(() => [Advisor], { nullable: 'items' })
    @OneToMany(() => Advisor, advisor => advisor.faculty, { cascade: true })
    advisors: Promise<Advisor[]>;


    constructor(faculty_id: string, faculty_name_en: string, faculty_name_th: string) {
        this.faculty_name_en = faculty_name_en;
        this.faculty_id = faculty_id;
        this.faculty_name_th = faculty_name_th;
    }
}
