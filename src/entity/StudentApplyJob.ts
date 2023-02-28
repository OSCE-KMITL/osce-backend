import { ObjectType, Field } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { JobStatus } from '../shared/types/JobStatus';
import { Job } from './Job';
import { Student } from './Student';

@Entity()
@ObjectType()
export class StudentApplyJob {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ default: null })
    student_id: string;

    @Column({ default: null })
    job_id: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    job_status: JobStatus;

    @Field(() => Student, { nullable: true })
    @ManyToOne(() => Student, (student) => student.student_apply_job)
    @JoinColumn({ name: 'student_id' })
    student: Promise<Student>;

    @Field(() => Job, { nullable: true })
    @ManyToOne(() => Job, (job) => job.student_apply_job)
    @JoinColumn({ name: 'job_id' })
    job: Promise<Job>;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(student_id: string, job_id: string, job_status: JobStatus) {
        this.student_id = student_id;
        this.job_id = job_id;
        this.job_status = job_status;
    }
}
