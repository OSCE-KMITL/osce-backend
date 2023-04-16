import { Advisor } from '../../../entity/Advisor';
import { AdvisorAccountInput, UpdateAdvisorArgs, UpdateAdvisorInput } from './input/AdvisorAccountInput';
import { AdvisorRepository } from '../AdvisorRepository';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountStatus, RoleOption } from '../../../shared/types/Roles';
import { AccountRepository } from '../../account/AccountRepository';
import { hashedPassword } from '../../../utils/hash-password';
import Base64 from 'crypto-js/enc-base64';


@Service()
export class AdvisorAccountService {
    private readonly repository = new AdvisorRepository(Advisor);
    private readonly account_repository = new AccountRepository(Account);

    constructor() {
    }

    async registerAdvisorAccount(input: AdvisorAccountInput): Promise<Account> {
        const { email, password, faculty, is_committee, name, last_name, name_prefix } = input;
        const hashed_password = await hashedPassword(password);
        const advisor_profile = new Advisor(name, last_name, is_committee, name_prefix);
        const advisor_account = new Account(email, hashed_password, is_committee ? RoleOption.COMMITTEE : RoleOption.ADVISOR);
        advisor_account.is_advisor = advisor_profile;
        return await this.account_repository.save(advisor_account);
    }

    async updateAdvisorAccount(payload: UpdateAdvisorArgs): Promise<Account | null | undefined> {
        const { advisor_status,  id,  is_committee}: UpdateAdvisorArgs = payload;
        try {
            const account = await this.account_repository.findOne('id',id);
            if(!account) throw new Error('ไม่พบบัญชีผู้ใช้นี้')

            account.is_advisor.is_committee = is_committee
            account.role =  is_committee ? RoleOption.COMMITTEE : RoleOption.ADVISOR
            account.status = advisor_status

            return await this.account_repository.save(account)

        } catch (e) {
            throw e;
        }
    }

    async getAdvisorAccounts(): Promise<Account[] | undefined> {
        try {
            const accounts = await this.account_repository.find();
            return accounts.filter((acc) => acc.role === RoleOption.ADVISOR || acc.role === RoleOption.COMMITTEE);
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
