import { ObjectType, Field } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Company } from './Company';
import { GraphQLJSONObject } from 'graphql-type-json';

@Entity()
@ObjectType()
export class CompanyAssessment {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ default: null })
    student_id: string;

    @Column({ default: null })
    company_id: string;

    @Field(() => Student, { nullable: true })
    @ManyToOne(() => Student, (student) => student.company_assessment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
    student: Promise<Student>;

    @Field(() => Company, { nullable: true })
    @ManyToOne(() => Company, (company) => company.company_assessment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
    company: Promise<Company>;

    @Field(() => GraphQLJSONObject)
    @Column({ type: 'json', default: null })
    assessment_obj: object;

    @Field()
    @Column({ default: null })
    score: number;

    @Field()
    @Column({ default: null })
    strength: string;

    @Field()
    @Column({ default: null })
    improvement: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(student_id: string, job_id: string, assessment_obj: object, score: number) {
        this.student_id = student_id;
        this.company_id = job_id;
        this.assessment_obj = assessment_obj;
        this.score = score;
    }
}
