import { StudentRegisterRepository } from './StudentRegisterRepository';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterInput } from '../args/StudentRegisterInput';
import { hashedPassword } from '../../../utils/hash-password';

@Service()
export class StudentRegisterService {
    private readonly repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);

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
}
