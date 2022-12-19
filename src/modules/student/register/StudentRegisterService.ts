import { StudentRegisterRepository } from './StudentRegisterRepository';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { RegisterInput } from './StudentRegisterController';
import { AccountRepository } from '../../AccountRepository';

@Service()
export class StudentRegisterService {
    private readonly repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);

    async registerStudent(input: RegisterInput): Promise<Account> {
        const { student_id, name, password, role, lastname, email } = input;
        const student = new Student(student_id, name, lastname);
        const account = new Account(email, password, role);
        account.is_student = student;
        return await this.account_repository.save(account);
    }

    async getStudents(): Promise<Account[] | null> {
        return await this.account_repository.find();
    }
}
