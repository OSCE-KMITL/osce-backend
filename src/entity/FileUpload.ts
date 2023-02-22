import { Job } from './Job';
import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@ObjectType()
export class FileUpload {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    original_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    current_name: string;

    @Column({ charset: 'utf8', collation: 'utf8_general_ci', default: null })
    @Field({ nullable: true })
    url: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
    updatedAt!: Date;

    @Field(() => Job)
    @ManyToOne(() => Job, (job) => job.id)
    @JoinColumn({ name: 'job_id' })
    job_id: Promise<Job>;

    constructor(original_name: string, current_name: string, url: string) {
        this.original_name = original_name;
        this.current_name = current_name;
        this.url = url;
    }
}
