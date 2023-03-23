import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';
import { Student } from './Student';

@Entity({ name: 'student_skill' })
@ObjectType()
export class StudentSkills {
    @Field(() => ID)
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    skill_name: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    level: string;

    //@Field(()=>Student ,{nullable:true})
    @ManyToOne(() => Student, (student) => student.skills ,{onDelete:"CASCADE"})
    @JoinColumn({ name: 'student_id' })
    student_id: Student;

    constructor(name: string, level: string, students: Student) {
        this.skill_name = name;
        this.level = level;
        this.student_id = students;
    }
}
