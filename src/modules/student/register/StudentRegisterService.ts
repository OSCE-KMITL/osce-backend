import { Job } from './../../../entity/Job';
import { JobRepository } from './../../job/JobRepository';
import { RoleOption } from './../../../shared/types/Roles';
import { StudentApplyJobInput } from './../args/StudentRegisterInput';
import { StudentRegisterRepository } from './StudentRegisterRepository';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { hashedPassword } from '../../../utils/hash-password';

@Service()
export class StudentRegisterService {
    constructor(
        private readonly job_repository = new JobRepository(Job),
        private readonly account_repository = new AccountRepository(Account),
        private readonly repository = new StudentRegisterRepository(Student)
    ) {}

    async registerStudent(input: StudentRegisterInput): Promise<Account> {
        const { student_id, name, password, role, lastname, email } = input;
        const hashed_password = await hashedPassword(password);
        const student = new Student(student_id, name, lastname);
        const account = new Account(email, hashed_password, role);
        account.is_student = student;
        return await this.account_repository.save(account);
    }

    async getStudents(): Promise<Student[] | undefined> {
        return await this.repository.find();
    }

    async applyJob(apply_info: StudentApplyJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id } = apply_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.STUDENT) throw new Error('นักศึกษาเท่านั้นที่สามารถสมัครงานได้');

        const job = await this.job_repository.findOne('id', job_id);
        if (!job) throw new Error('ไม่พบงานที่เปิดรับ');

        const student_id = account.is_student.student_id;
        const student = await this.repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        const arrayJob = await student.job;
        const count: number = arrayJob.length;
        if(count === 5) throw new Error('ไม่สามารถสมัครพร้อมกันเกิน 5 งาน')

        if (job.students === undefined) {
            job.students = [student];
        } else {
            job.students.push(student);
        }
        await this.job_repository.save(job);

        return await this.repository.save(student);
    }
}
