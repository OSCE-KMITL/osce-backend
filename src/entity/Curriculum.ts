import { Field, ID, ObjectType } from 'type-graphql';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import 'reflect-metadata';
import { Faculty } from './Faculty';
import {Student} from "./Student";
import { Advisor } from './Advisor';

@Entity()
@ObjectType()
export class Curriculum {

    @Field(()=>ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(()=>String)
    @Column()
    curriculum_id: string;

    @Field()
    @Column()
    faculty_id: string;

    @Field()
    @Column()
    dept_id: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    curriculum_name_en: string;


    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    curriculum_name_th: string;

    @Field()
    @Column()
    level_id: string;

    @Field(()=>[Student],{nullable:"items"})
    @OneToMany(()=>Student ,student => student.curriculum,{nullable:true })
    students:Promise<Student[]>


    @Field(() => [Advisor], { nullable: 'items' })
    @OneToMany(() => Advisor, advisor => advisor.curriculum, { cascade: true })
    advisors: Promise<Advisor[]>;

    constructor(curriculum_id: string, faculty_id: string, department_id: string, curriculum_name_en: string, curriculum_name_th: string, level_id: string) {
        this.curriculum_id = curriculum_id;
        this.faculty_id = faculty_id;
        this.dept_id = department_id;
        this.curriculum_name_en = curriculum_name_en;
        this.curriculum_name_th = curriculum_name_th;
        this.level_id = level_id;
    }


}
