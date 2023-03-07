import { StudentApplyJob } from './StudentApplyJob';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Job } from './Job';
import { Account } from './Account';
import { CoopStatus } from '../shared/types/CoopStatus';
import { CoopRegisterArgs } from '../modules/student/interfaces';
import { Faculty } from './Faculty';
import { Department } from './Department';
import { Curriculum } from './Curriculum';
import { StudentLanguageAbility } from './StudentLanguageAbility';
import { StudentSkills } from './StudentSkills';
import { TranscriptFileUpload } from './TranscriptFileUpload';

@Entity()
@ObjectType()
export class Student {
    @PrimaryColumn()
    @Field((type) => ID)
    student_id: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    name_eng: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    name_prefix: string;

    @Field(() => Faculty, { nullable: true })
    @ManyToOne(() => Faculty, (faculty) => faculty.students, { nullable: true, eager: true })
    @JoinColumn({ name: 'faculty' })
    faculty: Faculty;

    @Field(() => Department, { nullable: true })
    @ManyToOne(() => Department, (department) => department.students, { nullable: true, eager: true })
    @JoinColumn({ name: 'department' })
    department: Department;

    @Field(() => Curriculum, { nullable: true })
    @ManyToOne(() => Curriculum, (curr) => curr.students, { nullable: true, eager: true })
    @JoinColumn({ name: 'curriculum' })
    curriculum: Curriculum;

    @Field(() => [TranscriptFileUpload], { nullable: 'items' })
    @OneToOne(() => TranscriptFileUpload, (transcript) => transcript.student_id, { nullable: true, eager: true, cascade: true })
    transcript: TranscriptFileUpload;

    @Field(() => [StudentLanguageAbility], { nullable: 'items' })
    @OneToMany(() => StudentLanguageAbility, (skill) => skill.students, { nullable: true, eager: true, cascade: true })
    language_abilities: StudentLanguageAbility[];

    @Field(() => [StudentSkills], { nullable: 'items' })
    @OneToMany(() => StudentSkills, (skill) => skill.students, { nullable: true, eager: true, cascade: true })
    skills: StudentSkills[];

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    lastname_eng: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    name_th: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', nullable: true })
    @Field({ nullable: true })
    lastname_th: string;

    @Field(() => Account)
    @OneToOne(() => Account, (account) => account.is_student)
    account: Promise<Account>;

    @Field(() => CoopStatus)
    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: CoopStatus.DEFAULT })
    coop_status: CoopStatus;

    @Field({ nullable: true })
    @Column({ nullable: true })
    gpa: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    gender: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    religion: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    military_status: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
    driver_license: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true, unique: true })
    citizen_id: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    weight: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    height: string;

    @Field({ nullable: true })
    @Column({ type: 'longtext', nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    address: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    phone_number: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    emer_relation: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    emer_name: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    emer_lastname: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    emer_tel: string;

    @Field({ nullable: true })
    @Column({ nullable: true, charset: 'utf8', collation: 'utf8_general_ci' })
    birth_date: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @Field(() => [StudentApplyJob], { nullable: 'items' })
    @OneToMany(() => StudentApplyJob, (student_apply_job) => student_apply_job.student, { cascade: true, eager: true })
    @JoinColumn({ name: 'student_apply_job' })
    student_apply_job: StudentApplyJob[];

    @Field(() => Job, { nullable: true })
    @ManyToOne(() => Job, (job) => job.students, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'applied_job' })
    job: Promise<Job>;

    constructor(student_id: string, name_eng: string, lastname: string) {
        this.student_id = student_id;
        this.name_eng = name_eng;
        this.lastname_eng = lastname;
    }

    applyCoop(payload: CoopRegisterArgs) {
        this.name_th = payload.name_th;
        this.lastname_th = payload.lastname_th;
        this.gpa = payload.gpa;
        this.gender = payload.gender;
        this.religion = payload.religion;
        this.military_status = payload.military_status;
        this.driver_license = payload.driver_license;
        this.citizen_id = payload.citizen_id;
        this.weight = payload.weight;
        this.height = payload.height;
        this.address = payload.address;
        this.phone_number = payload.phone_number;
        this.emer_relation = payload.emer_relation;
        this.emer_name = payload.emer_name;
        this.emer_lastname = payload.emer_lastname;
        this.emer_tel = payload.emer_tel;
        this.birth_date = payload.birth_date;
        this.coop_status = CoopStatus.APPLYING;
        return this;
    }
}
