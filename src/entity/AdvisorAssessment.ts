import { ObjectType, Field } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Advisor } from './Advisor';

@Entity()
@ObjectType()
export class AdvisorAssessment {
    @PrimaryGeneratedColumn('increment')
    @Field({ nullable: false })
    id: string;

    @Column({ default: null, nullable: true })
    student_id: string;

    @Column({ default: null, nullable: true })
    advisor_id: string;

    @Field(() => Student, { nullable: true })
    @ManyToOne(() => Student, (student) => student.advisor_assessment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
    student: Promise<Student>;

    @Field(() => Advisor, { nullable: true })
    @ManyToOne(() => Advisor, (advisor) => advisor.advisor_assessment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'advisor_id', referencedColumnName: 'advisor_id' })
    advisor: Promise<Advisor>;

    @Field(() => GraphQLJSONObject)
    @Column({ type: 'json', default: null,})
    assessment_obj: object;

    @Field()
    @Column({ default: null, nullable: true })
    score: number;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    constructor(student_id: string, advisor_id: string, assessment_obj: object, score: number) {
        this.student_id = student_id;
        this.advisor_id = advisor_id;
        this.assessment_obj = assessment_obj;
        this.score = score;
    }
}
