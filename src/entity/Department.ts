import {Field, ID, ObjectType} from 'type-graphql';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import 'reflect-metadata';
import {Student} from "./Student";
import { Advisor } from './Advisor';

@Entity()
@ObjectType()
export class Department {
    @Field(() => ID)
    @PrimaryGeneratedColumn("increment")
    private readonly id:string

    @Field()
    @Column({unique:false})
    department_id: string;


    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    faculty_id:string ;


    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    department_name_en: string;

    @Field()
    @Column({ charset: 'utf8', collation: 'utf8_general_ci' })
    department_name_th: string;

    @Field(()=>[Student] ,{nullable:"items"})
    @OneToMany(()=> Student , student => student.department ,{nullable:true})
    students:Promise<Student[]>

    @Field(() => [Advisor], { nullable: 'items' })
    @OneToMany(() => Advisor, advisor => advisor.department, { cascade: true })
    advisors: Promise<Advisor[]>;

    constructor(department_id: string, department_name_en: string, department_name_th: string,faculty_id:string) {
        this.department_id = department_id;
        this.department_name_en = department_name_en;
        this.department_name_th = department_name_th;
        this.faculty_id = faculty_id;
    }
}
