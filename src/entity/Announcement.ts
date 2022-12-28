import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import 'reflect-metadata';
import { v4 as uuid } from 'uuid';
import { Advisor } from './Advisor';

@Entity()
@ObjectType()
export class Announcement {
    @PrimaryGeneratedColumn('increment')
    @Field()
    id: string;

    @Column({ type: 'varchar' })
    @Field()
    title: string;

    @Column({ type: 'text' })
    @Field()
    description: string;

    @Field()
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', name: 'created_at' })
    createdAt!: Date;

    @Field(() => Advisor)
    @ManyToOne(() => Advisor, (advisor) => advisor.advisor_id)
    @JoinColumn({ name: 'advisor_id' })
    advisor_id: Promise<Advisor>;

    @Field()
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'updated_at' })
    updatedAt!: Date;

    constructor(title: string, desc: string) {
        this.title = title;
        this.description = desc;
    }
}
