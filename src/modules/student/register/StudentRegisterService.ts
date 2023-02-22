import {
    StudentCurriculumRepository,
    StudentDepartmentRepository,
    StudentFacultyRepository,
    StudentLanguageRepository,
    StudentRegisterRepository,
    StudentSkillsRepository,
} from './StudentRegisterRepository';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { hashedPassword } from '../../../utils/hash-password';
import { CoopRegisterArgs, LanguageAbility, Skill } from '../interfaces';
import { RoleOption } from '../../../shared/types/Roles';
import { roleValidation } from '../../../utils/common-utils';
import { Faculty } from '../../../entity/Faculty';
import { Department } from '../../../entity/Department';
import { Curriculum } from '../../../entity/Curriculum';
import { StudentLanguageAbility } from '../../../entity/StudentLanguageAbility';
import { StudentSkills } from '../../../entity/StudentSkills';
import { Arg } from 'type-graphql';

@Service()
export class StudentRegisterService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly faculty_repository = new StudentFacultyRepository(Faculty);
    private readonly department_repository = new StudentDepartmentRepository(Department);
    private readonly curriculum_repository = new StudentCurriculumRepository(Curriculum);
    private readonly lang_repository = new StudentLanguageRepository(StudentLanguageAbility);
    private readonly skill_repository = new StudentSkillsRepository(StudentSkills);

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

    async registerCoop(payload: CoopRegisterArgs, user_id: string, skills: Skill[], language_abilities: LanguageAbility[]): Promise<any> {
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

            return await this.student_repository.save(student_applied);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
