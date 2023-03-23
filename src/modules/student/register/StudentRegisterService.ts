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
import { CommitteeCoopRegisterArgs, CoopRegisterArgs, LanguageAbility, Skill } from '../interfaces';
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
import { CoopStatus } from '../../../shared/types/CoopStatus';

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

    async deleteStudent(student_id: string): Promise<Student | null | undefined> {
        try {
            const already_exist_student = await this.student_repository.findOne('student_id', student_id);
            if (!already_exist_student) throw new Error('ไม่พบนักศึกษาที่ต้องการจะลบ');

            const already_exist_account = await already_exist_student.account;

            // if already exist in account just delete in account  table
            if (already_exist_account) {
                await this.account_repository.delete(already_exist_account);
                const deleted_student = await this.student_repository.delete(already_exist_student);
                return deleted_student;
            } else {
                // if not already exist in account just delete in student  table
                const deleted_student = await this.student_repository.delete(already_exist_student);
                return deleted_student;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getStudentsApply(): Promise<Student[] | undefined> {
        try {
            const students = await this.student_repository.find();
            return students.filter((students) => students.coop_status !== CoopStatus.DEFAULT);
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

    async committeeChangeCoopStatus(student_id: string, status: CoopStatus): Promise<Student | undefined> {
        try {
            const student = await this.student_repository.findOne('student_id', student_id);

            if (!student) {
                throw new Error('ไม่พบนักศึกษาที่ต้องการจะแก้ไข');
            }

            student.coop_status = status;

            return await this.student_repository.save(student);
        } catch (error) {
            throw error;
            console.log(error);
        }
    }

    async committeeAddRegisterStudent(payload: CommitteeCoopRegisterArgs, user_id: string): Promise<Student> {
        try {
            const already_exist_student = await this.student_repository.findOne('student_id', payload.student_id.trim().toLocaleLowerCase());

            if (already_exist_student) {
                throw new Error('มีรหัสนักศึกษานี้อยู่ในระบบแล้ว !');
            }

            const student = new Student(payload.student_id, '', '');
            student.name_th = payload.name_th;
            student.lastname_th = payload.lastname_th;
            student.coop_status = payload.coop_status;
            student.name_prefix = payload.name_prefix;

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

            student.faculty = student_faculty;
            student.department = student_department;
            student.curriculum = student_curriculum;

            return await this.student_repository.save(student);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async registerCoop(
        payload: CoopRegisterArgs,
        user_id: string,
        skills: Skill[],
        language_abilities: LanguageAbility[],
        transcript_file: Upload
    ): Promise<Student> {
        try {
            const account = await this.account_repository.findOne('id', user_id);
            if (!account) throw new Error('คุณไม่มีสิทธิเข้าถึง');

            // validate this account is student ?
            // roleValidation(account, RoleOption.STUDENT);
            // roleValidation(account, RoleOption.COMMITTEE);

            // get student object
            const already_student = await this.student_repository.findOne('student_id', payload.student_id);
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

            if (payload.coop_status) {
                student_applied.coop_status === payload.coop_status;
            }

            let student_skills: StudentSkills[] = [];
            let student_language_abilities: StudentLanguageAbility[] = [];

            if (skills) {
                student_skills = skills.map((skill) => {
                    return new StudentSkills(skill.skill_name, skill.level, student_applied);
                });
            }

            if (language_abilities) {
                student_language_abilities = language_abilities.map((lang) => {
                    return new StudentLanguageAbility(lang.name, lang.level, student_applied);
                });
            }

            // saved skill to student
            student_applied.skills = student_skills;
            student_applied.language_abilities = student_language_abilities;

            // delete row contrain null as student_id in skill & language databases
            this.skill_repository.deleteMany('student_id', 'null');
            this.lang_repository.deleteMany('student_id', 'null');

            if (transcript_file) {
                const { createReadStream, filename, mimetype, encoding } = await transcript_file;
                const { ext } = path.parse(filename);
                const year_now = new Date().getFullYear().toString();
                const random_name = generateRandomString(12) + ext;
                const original_name = filename;
                const current_name = year_now + '_' + 'transcript' + '_' + student_applied.student_id + '_' + random_name;
                const url = `http://localhost:${PORT}/files/student_transcript/${current_name}`;

                try {
                    let alreadyExistfile = await this.transcript_repository.findOne('student_id', student_applied.student_id);
                    if (alreadyExistfile) {
                        const transcirpt_obj = new TranscriptFileUpload(original_name, current_name, url);
                        alreadyExistfile = transcirpt_obj;
                        const transcirpt_file = await this.transcript_repository.save(alreadyExistfile);
                        student_applied.transcript = transcirpt_file;
                        createReadStream().pipe(createWriteStream(__dirname + `/../../../../public/files/student_transcript/${current_name}`));
                    } else {
                        const transcirpt_obj = new TranscriptFileUpload(original_name, current_name, url);
                        transcirpt_obj.student_id = student_applied;
                        const transcript_new = await this.transcript_repository.save(transcirpt_obj);
                        student_applied.transcript = transcript_new;
                    }
                } catch (error) {
                    throw new Error('Error , Can not saved transcritp files');
                }
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
}
