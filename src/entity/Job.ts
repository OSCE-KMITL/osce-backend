import { Student } from './Student';
import { FileUpload } from './FileUpload';
import { Company } from './Company';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
@ObjectType()
export class Job {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    job_title: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    required_major: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    project_topic: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    nature_of_work: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    required_skills: string;

    @Column({ default: null })
    @Field({ nullable: true })
    limit: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    welfare: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    compensation: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    internship_period: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    work_period: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    coordinator_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    coordinator_job_title: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    coordinator_email: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    coordinator_phone_number: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    supervisor_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    supervisor_job_title: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    supervisor_email: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    supervisor_phone_number: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
    updatedAt!: Date;

    @Field(() => Company, { nullable: true })
    @ManyToOne(() => Company, (company) => company.id)
    @JoinColumn({ name: 'company_id' })
    company_id: Promise<Company>;

    @Field(() => [FileUpload], { nullable: 'items' })
    @OneToMany(() => FileUpload, (file_upload) => file_upload.job_id, { cascade: true, eager: true })
    file_upload: FileUpload[];

    @Field(() => [Student], { nullable: 'items' })
    @ManyToMany(() => Student, (student) => student.job, { cascade: true, eager: true, nullable: true })
    @JoinTable({
        name: 'apply_job',
        joinColumn: {
            name: 'job',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'student',
            referencedColumnName: 'student_id',
        },
    })
    students: Student[];

    constructor(
        job_title: string,
        required_major: string,
        project_topic: string,
        nature_of_work: string,
        required_skills: string,
        limit: string,
        welfare: string,
        compensation: string,
        internship_period: string,
        work_period: string,
        coordinator_name: string,
        coordinator_job_title: string,
        coordinator_email: string,
        coordinator_phone_number: string,
        supervisor_name: string,
        supervisor_job_title: string,
        supervisor_email: string,
        supervisor_phone_number: string
    ) {
        this.job_title = job_title;
        this.required_major = required_major;
        this.project_topic = project_topic;
        this.nature_of_work = nature_of_work;
        this.required_skills = required_skills;
        this.limit = limit;
        this.welfare = welfare;
        this.compensation = compensation;
        this.internship_period = internship_period;
        this.work_period = work_period;
        this.coordinator_name = coordinator_name;
        this.coordinator_job_title = coordinator_job_title;
        this.coordinator_phone_number = coordinator_phone_number;
        this.coordinator_email = coordinator_email;
        this.supervisor_job_title = supervisor_job_title;
        this.supervisor_name = supervisor_name;
        this.supervisor_phone_number = supervisor_phone_number;
        this.supervisor_email = supervisor_email;
    }
}
