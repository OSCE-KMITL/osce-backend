import { Advisor } from '../../../entity/Advisor';
import { AdvisorAccountInput, UpdateAdvisorArgs } from './input/AdvisorAccountInput';
import { AdvisorRepository } from '../AdvisorRepository';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { RoleOption } from '../../../shared/types/Roles';
import { AccountRepository } from '../../account/AccountRepository';
import { hashedPassword } from '../../../utils/hash-password';
import { StudentDepartmentRepository } from '../../student/register/StudentRegisterRepository';
import { Department } from '../../../entity/Department';

@Service()
export class AdvisorAccountService {
    private readonly repository = new AdvisorRepository(Advisor);
    private readonly account_repository = new AccountRepository(Account);
    private readonly department_repository = new StudentDepartmentRepository(Department);

    constructor() {}

    async registerAdvisorAccount(input: AdvisorAccountInput, user_id: string): Promise<Account> {
        const { email, is_committee, name, last_name, name_prefix } = input;

        const user = await this.account_repository.findOne('id', user_id);
        if (!user) throw new Error('Your not Authorized');

        if (user.role === RoleOption.SUPER_ADMIN) {
            const advisor_profile = new Advisor(
                name.trim().toLowerCase(),
                last_name.trim().toLowerCase(),
                is_committee === RoleOption.COMMITTEE,
                name_prefix.trim().toLowerCase()
            );
            const mock_pass = '123456';
            const hashed_password = await hashedPassword(mock_pass);
            const advisor_account = new Account(
                email.trim().toLowerCase(),
                hashed_password,
                is_committee === RoleOption.COMMITTEE ? RoleOption.COMMITTEE : RoleOption.ADVISOR
            );
            advisor_account.is_advisor = advisor_profile;
            return await this.account_repository.save(advisor_account);
        }

        const already_exist_email = await this.account_repository.findOne('email', email);

        if (already_exist_email) throw new Error('พบอีเมลนี้อยู่ในระบบแล้ว');

        // const mock_pass =  Date.now() + process.env.CRYPTO_KEY!
        const mock_pass = '123456';
        const hashed_password = await hashedPassword(mock_pass);
        const advisor_profile = new Advisor(
            name.trim().toLowerCase(),
            last_name.trim().toLowerCase(),
            is_committee === RoleOption.COMMITTEE,
            name_prefix.trim().toLowerCase()
        );

        advisor_profile.department = user.is_advisor.department;
        advisor_profile.faculty = user.is_advisor.faculty;

        const advisor_account = new Account(email.trim().toLowerCase(), hashed_password, is_committee ? RoleOption.COMMITTEE : RoleOption.ADVISOR);

        advisor_account.is_advisor = advisor_profile;

        return await this.account_repository.save(advisor_account);
    }

    async updateAdvisorAccount(payload: UpdateAdvisorArgs): Promise<Account | null | undefined> {
        const { advisor_status, account_id, is_committee }: UpdateAdvisorArgs = payload;
        try {
            const account = await this.account_repository.findOne('id', account_id);
            if (!account) throw new Error('ไม่พบบัญชีผู้ใช้นี้');

            account.is_advisor.is_committee = is_committee;
            account.role = is_committee ? RoleOption.COMMITTEE : RoleOption.ADVISOR;
            account.status = advisor_status;

            return await this.account_repository.save(account);
        } catch (e) {
            throw e;
        }
    }

    async getAdvisorAccounts(user_id: string): Promise<Account[] | undefined> {
        try {
            const user = await this.account_repository.findOne('id', user_id);
            if (!user) throw new Error('Your not Authorized');

            const accounts = await this.account_repository.find();
            const advisor_accounts = accounts.filter((acc) => acc.role === RoleOption.ADVISOR || acc.role === RoleOption.COMMITTEE);

            if (user.role === RoleOption.SUPER_ADMIN) {
                return advisor_accounts;
            } else if (user.role === RoleOption.ADVISOR || user.role === RoleOption.COMMITTEE) {
                return advisor_accounts
                    .filter(
                        (account) =>
                            account.is_advisor.department.department_name_en.trim().toLocaleLowerCase() ===
                            user.is_advisor.department.department_name_en.trim().toLocaleLowerCase()
                    )
                    .sort((a, b) => {
                        if (a.created_at > b.created_at) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
            } else {
                throw new Error('Your not Authorized');
            }
        } catch (error) {
            throw error;
        }
    }

    async getAdvisorAccount(id: string): Promise<Account | null> {
        return await this.account_repository.findOne('id', id);
    }

    async deleteAdvisorAccount(id: string) {
        const already_account = await this.account_repository.findOne('id', id);
        if (!already_account) throw new Error('ไม่พบผู้ใช้ที่ต้องการจะลบ');

        // delete advisor from advisor database.
        const advisor_id = already_account.is_advisor.advisor_id;
        const advisor = await this.repository.findOne('advisor_id', advisor_id);
        if (!advisor) throw new Error('something went wrong !');

        const deleted_advisor = await this.repository.delete(advisor);
        if (!deleted_advisor) throw new Error('something went wrong !');

        return await this.account_repository.delete(already_account);
    }
}
