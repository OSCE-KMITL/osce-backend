import {
    StudentCurriculumRepository,
    StudentDepartmentRepository,
    StudentFacultyRepository,
    StudentLanguageRepository,
    StudentRegisterRepository,
    StudentSkillsRepository,
} from './StudentRegisterRepository';
import { Job } from './../../../entity/Job';
import { JobRepository } from './../../job/JobRepository';
import { RoleOption } from './../../../shared/types/Roles';
import { StudentApplyJobInput } from './../args/StudentRegisterInput';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { hashedPassword } from '../../../utils/hash-password';
import mysql from 'mysql2';
import { DATABASE_PORT, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_NAME } from './../../../shared/constants/index';
import { CoopRegisterArgs, LanguageAbility, Skill } from '../interfaces';
import { roleValidation } from '../../../utils/common-utils';
import { Faculty } from '../../../entity/Faculty';
import { Department } from '../../../entity/Department';
import { Curriculum } from '../../../entity/Curriculum';
import { StudentLanguageAbility } from '../../../entity/StudentLanguageAbility';
import { StudentSkills } from '../../../entity/StudentSkills';
import { TranscriptUploadRepository } from './StudentRegisterRepository';
import { TranscriptFileUpload } from '../../../entity/TranscriptFileUpload';
import { Upload } from '../../../shared/types/Upload';
import path from 'path';
import { generateRandomString } from '../../../utils/random-string';
import { PORT } from '../../../shared/constants';
import { createWriteStream } from 'fs';

@Service()
export class StudentRegisterService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly faculty_repository = new StudentFacultyRepository(Faculty);
    private readonly department_repository = new StudentDepartmentRepository(Department);
    private readonly curriculum_repository = new StudentCurriculumRepository(Curriculum);
    private readonly lang_repository = new StudentLanguageRepository(StudentLanguageAbility);
    private readonly skill_repository = new StudentSkillsRepository(StudentSkills);
    private readonly job_repository = new JobRepository(Job);
    private readonly transcript_repository = new TranscriptUploadRepository(TranscriptFileUpload);

    constructor() {}

    async registerStudent(input: StudentRegisterInput): Promise<Account> {
        const { student_id, name_eng, password, role, lastname_eng, email } = input;
        const hashed_password = await hashedPassword(password);
        const student = new Student(student_id, name_eng, lastname_eng);
        const account = new Account(email, hashed_password, role);
        account.is_student = student;
        return await this.account_repository.save(account);
    }

    async getStudents(): Promise<Student[] | undefined> {
        try {
            return await this.student_repository.find();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getStudent(student_id: string): Promise<Student | null> {
        try {
            return await this.student_repository.findOne('student_id', student_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getStudentsByDepartment(department_id: string): Promise<Student[] | null> {
        try {
            const department = await this.department_repository.findOne('id', department_id);
            console.log(department);
            if (!department) {
                return null;
            }

            return department.students;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async registerCoop(
        payload: CoopRegisterArgs,
        user_id: string,
        skills: Skill[],
        language_abilities: LanguageAbility[],
        transcript_file: Upload
    ): Promise<any> {
        try {
            const account = await this.account_repository.findOne('id', user_id);
            if (!account) throw new Error('คุณไม่มีสิทธิเข้าถึง');

            // validate this account is student ?
            roleValidation(account, RoleOption.STUDENT);

            // get student object
            const already_student = account.is_student;
            if (!already_student) throw new Error('ไม่พบข้อมูลการเป็นนักศึกษา');

            let student_faculty: Faculty;
            let student_curriculum: Curriculum;
            let student_department: Department;

            // search for already exist faculty
            const existing_faculty = await this.faculty_repository.findOne('faculty_id', payload.faculty_id);
            if (!existing_faculty) {
                const faculty = new Faculty(payload.faculty_id, payload.faculty_name_en, payload.faculty_name_th);
                student_faculty = await this.faculty_repository.save(faculty);
            } else {
                student_faculty = existing_faculty;
            }

            // search for already exist department
            const existing_department = await this.department_repository.findOne('department_name_en', payload.department_name_en);
            if (!existing_department) {
                // if not just create new department
                const department = new Department(payload.department_id, payload.department_name_en, payload.department_name_th, payload.faculty_id);
                student_department = await this.department_repository.save(department);
            } else {
                student_department = existing_department;
            }

            const existing_curr = await this.curriculum_repository.findOne('curriculum_name_en', payload.curriculum_name_en);
            if (!existing_curr) {
                const curriculum = new Curriculum(
                    payload.curriculum_id,
                    payload.faculty_id,
                    payload.department_id,
                    payload.curriculum_name_en,
                    payload.curriculum_name_th,
                    payload.level_id
                );
                student_curriculum = await this.curriculum_repository.save(curriculum);
            } else {
                student_curriculum = existing_curr;
            }

            // student object call method for fulfill
            const student_applied = already_student.applyCoop(payload);
            student_applied.department = student_department;
            student_applied.faculty = student_faculty;
            student_applied.curriculum = student_curriculum;

            if (skills) {
                if (skills.length !== 0 || true) {
                    skills.forEach((skill) => {
                        const student_skill = new StudentSkills(skill.skill_name, skill.level, student_applied);
                        this.skill_repository.save(student_skill);
                    });
                }
            }

            if (language_abilities) {
                if (language_abilities.length !== 0 || true) {
                    language_abilities.forEach((lang) => {
                        const new_lang = new StudentLanguageAbility(lang.name, lang.level, student_applied);
                        this.lang_repository.save(new_lang);
                    });
                }
            }

            if (transcript_file) {
                const { createReadStream, filename, mimetype, encoding } = await transcript_file;
                const { ext } = path.parse(filename);
                const year_now = new Date().getFullYear().toString();
                const random_name = generateRandomString(12) + ext;
                const original_name = filename;
                const current_name = year_now + '_' + 'transcript' + '_' + student_applied.student_id + '_' + random_name;
                const url = `http://localhost:${PORT}/files/student_transcript/${current_name}`;

                try {
                    createReadStream().pipe(createWriteStream(__dirname + `/../../../../public/files/student_transcript/${current_name}`));
                    const transcirpt_obj = new TranscriptFileUpload(original_name, current_name, url);
                    const transcirpt_file = await this.transcript_repository.save(transcirpt_obj);

                    student_applied.transcript = transcirpt_file;
                } catch (error) {
                    throw new Error('Error , Can not saved transcritp files');
                }
            } else {
                throw new Error('กรุณาแนบใบแสดงผลการเรียน (Transcript)');
            }

            return await this.student_repository.save(student_applied);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async applyJob(apply_info: StudentApplyJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id } = apply_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.STUDENT) throw new Error('นักศึกษาเท่านั้นที่สามารถสมัครงานได้');

        const job = await this.job_repository.findOne('id', job_id);
        if (!job) throw new Error('ไม่พบงานที่เปิดรับ');

        const student_id = account.is_student.student_id;
        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        const arrayJob = await student.job;
        const count: number = arrayJob.length;
        if (count === 5) throw new Error('ไม่สามารถสมัครพร้อมกันเกิน 5 งาน');

        if (job.students === undefined) {
            job.students = [student];
        } else {
            job.students.push(student);
        }
        await this.job_repository.save(job);

        return await this.student_repository.save(student);
    }

    async cancelApply(cancel_apply_info: StudentApplyJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id } = cancel_apply_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.STUDENT) throw new Error('นักศึกษาเท่านั้นที่สามารถยกเลิกสมัครงานได้');

        const job = await this.job_repository.findOne('id', job_id);
        if (!job) throw new Error('ไม่พบงานที่เปิดรับ');

        const student_id = account.is_student.student_id;
        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        if (student_id && job.id) {
            const connection = mysql.createConnection({
                host: 'localhost',
                port: parseInt(DATABASE_PORT!),
                user: DATABASE_USERNAME,
                password: DATABASE_PASSWORD,
                database: DATABASE_NAME,
            });

            connection.query(`DELETE FROM apply_job WHERE job = ${job.id} AND student = ${student_id}`, (err, results) => {
                if (err) {
                    console.error(err);
                    // Handle error
                    connection.end();
                } else {
                    console.log(`Deleted`);
                    // Handle success
                    connection.end();
                }
            });
        }

        return await this.student_repository.save(student);
    }

    // const arrayJob = await student.job;
    // const count: number = arrayJob.length;
    // if(count === 5) throw new Error('ไม่สามารถสมัครพร้อมกันเกิน 5 งาน')

    // if (job.students === undefined) {
    //     job.students = [student];
    // } else {
    //     job.students.push(student);
    // }
    // await this.job_repository.save(job);
}
