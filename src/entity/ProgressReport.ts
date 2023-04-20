import { Field, ObjectType } from 'type-graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import 'reflect-metadata';
import { Student } from './Student';

@Entity()
@ObjectType()
export class ProgressReport {
    @PrimaryGeneratedColumn('increment')
    @Field()
    progress_report_id: string;

    @Column({ type: 'integer' })
    @Field(() => Number)
    report_no: number;

    @Column({ type: 'integer' })
    @Field(() => Number)
    commute_score: number;

    @Column({ type: 'integer' })
    @Field(() => Number)
    advisement_score: number;

    @Column({ type: 'integer' })
    @Field(() => Number)
    work_score: number;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', type: 'longtext' })
    @Field()
    current_res: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    mentor_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    mentor_position: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    mentor_email: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    mentor_tel: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', type: 'longtext' })
    @Field()
    other_suggest: string;

    @Field(() => Student)
    @ManyToOne(() => Student, (Student) => Student.student_id, { lazy: true })
    @JoinColumn({ name: 'student_id' })
    student_id: Student;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'updated_at',
    })
    updated_at!: Date;


    constructor(report_no: number, commute_score: number, advisement_score: number, work_score: number, current_res: string, mentor_name: string, mentor_position: string, other_suggest: string, mentor_tel: string ,mentor_email:string) {
        this.report_no = report_no;
        this.commute_score = commute_score;
        this.advisement_score = advisement_score;
        this.work_score = work_score;
        this.current_res = current_res;
        this.mentor_name = mentor_name;
        this.mentor_position = mentor_position;
        this.other_suggest = other_suggest;
        this.mentor_tel = mentor_tel;
        this.mentor_email = mentor_email;
    }
}
