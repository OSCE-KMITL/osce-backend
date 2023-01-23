import { Company } from './Company';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Job {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    job_title: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    required_major: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    project_topic: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    nature_of_work: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    required_skills: string;

    @Column()
    @Field()
    limit: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    welfare: string;

    @Column()
    @Field()
    compensation: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    @Field()
    coop301_fileurl: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
    updatedAt!: Date;

    @Field(() => Company,{nullable: true})
    @ManyToOne(() => Company, (company) => company.id)
    @JoinColumn({ name: 'company_id' })
    company_id: Promise<Company>;

    constructor(
        job_title: string,
        required_major: string,
        project_topic: string,
        nature_of_work: string,
        required_skills: string,
        limit: string,
        welfare: string,
        compensation: string,
        coop301_fileurl: string
    ) {
        this.job_title = job_title;
        this.required_major = required_major;
        this.project_topic = project_topic;
        this.nature_of_work = nature_of_work;
        this.required_skills = required_skills;
        this.limit = limit;
        this.welfare = welfare;
        this.compensation = compensation;
        this.coop301_fileurl = coop301_fileurl;
    }
}
