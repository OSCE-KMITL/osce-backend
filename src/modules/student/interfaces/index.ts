import { ArgsType, Field, InputType } from 'type-graphql';
import { CoopStatus } from '../../../shared/types/CoopStatus';

@InputType()
export class Skill {
    @Field(() => String)
    skill_name: string;

    @Field(() => String)
    level: string;
}

@InputType()
export class LanguageAbility {
    @Field(() => String)
    name: string;

    @Field(() => String)
    level: string;
}

@InputType()
export class StudentList {
    @Field(() => String)
    name: string;

    @Field(() => String)
    level: string;
}

@ArgsType()
export class LanguageAbilities {
    @Field(() => [LanguageAbility], { nullable: true })
    language_abilities: LanguageAbility[];
}

@ArgsType()
export class StudentIdList {
    @Field(() => [String], { nullable: 'items' })
    students_id_list: String[];
}

@ArgsType()
export class SkillsArgs {
    @Field(() => [Skill], { nullable: true })
    skills: Skill[];
}

@InputType()
export class CoopRegisterArgs {
    @Field({ nullable: true })
    level_id: string;

    @Field({ nullable: false })
    student_id: string;

    @Field({ nullable: true })
    coop_status: CoopStatus;

    @Field({ nullable: true })
    curriculum_id: string;

    @Field({ nullable: true })
    curriculum_name_th: string;

    @Field({ nullable: true })
    curriculum_name_en: string;

    @Field({ nullable: true })
    name_th: string;

    @Field({ nullable: true })
    name_prefix: string;

    @Field({ nullable: true })
    lastname_th: string;

    @Field({ nullable: true })
    gpa: string;

    @Field({ nullable: true })
    gender: string;

    @Field({ nullable: true })
    religion: string;

    @Field({ nullable: true })
    military_status: boolean;

    @Field({ nullable: true })
    driver_license: boolean;

    @Field({ nullable: true })
    citizen_id: string;

    @Field({ nullable: true })
    weight: string;

    @Field({ nullable: true })
    height: string;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    phone_number: string;

    @Field({ nullable: true })
    emer_relation: string;

    @Field({ nullable: true })
    emer_name: string;

    @Field({ nullable: true })
    emer_lastname: string;

    @Field({ nullable: true })
    emer_tel: string;

    @Field({ nullable: true })
    birth_date: string;

    @Field({ nullable: true })
    faculty_id: string;

    @Field({ nullable: true })
    faculty_name_th: string;

    @Field({ nullable: true })
    faculty_name_en: string;

    @Field({ nullable: true })
    department_id: string;

    @Field({ nullable: true })
    department_name_en: string;

    @Field({ nullable: true })
    department_name_th: string;
}

@InputType()
export class CommitteeCoopRegisterArgs {
    @Field({ nullable: false })
    student_id: string;

    @Field({ nullable: true })
    name_th: string;

    @Field({ nullable: true })
    name_prefix: string;

    @Field({ nullable: true })
    lastname_th: string;

    @Field({ nullable: true })
    coop_status: CoopStatus;

    @Field({ nullable: true })
    curriculum_id: string;

    @Field({ nullable: true })
    curriculum_name_th: string;

    @Field({ nullable: true })
    curriculum_name_en: string;

    @Field({ nullable: true })
    level_id: string;

    @Field({ nullable: true })
    faculty_id: string;

    @Field({ nullable: true })
    faculty_name_th: string;

    @Field({ nullable: true })
    faculty_name_en: string;

    @Field({ nullable: true })
    department_id: string;

    @Field({ nullable: true })
    department_name_en: string;

    @Field({ nullable: true })
    department_name_th: string;
}

/*const mock = {
    student_id: '63015208',
    name_th: 'อภิสิทธิ์',
    lastname_th: 'ทับแสง',
    gpa: '3.12',
    gender: 'ชาย',
    religion: 'พุทธ',
    military_status: true,
    driver_license: true,
    citizen_id: '1350800310697',
    weight: '75',
    height: '175',
    address: 'หอพักอยู่สบาย 1471/1 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร 10520',
    phone_number: '0934358753',
    emer_relation: 'พี่/น้อง',
    emer_name: 'ใจดี',
    emer_lastname: 'มากทรัพ',
    emer_tel: '0933554165',
    birth_date: '2023-02-07',
    faculty: {
        faculty_id: '01',
        faculty_name_th: 'วิศวกรรมศาสตร์',
        faculty_name_en: 'Engineering',
    },
    department: {
        faculty_id: '01',
        department_id: '05',
        department_name_th: 'วิศวกรรมคอมพิวเตอร์',
        department_name_en: 'Computer Engineering',
    },
    curriculum: {
        level_id: '1',
        faculty_id: '01',
        dept_id: '05',
        curriculum_id: '101',
        curriculum_name_th: 'วิศวกรรมคอมพิวเตอร์ (ต่อเนื่อง)',
        curriculum_name_en: 'Computer Engineering (Continuing Education)',
    },
    skills: [
        {
            level: 'Good',
            skill_name: 'python',
        },
    ],
    Language_abilities: [
        {
            level: 'Excellent',
            name: 'english',
        },
    ],
};*/
