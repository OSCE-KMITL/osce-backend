import { Advisor } from '../../../entity/Advisor';
import { AdvisorAccountInput } from './input/AdvisorAccountInput';
import { AdvisorRepository } from '../AdvisorRepository';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { ERole } from '../../../shared/types/Roles';
import { AccountRepository } from '../../account/AccountRepository';

@Service()
export class AdvisorAccountService {
    private readonly repository = new AdvisorRepository(Advisor);
    private readonly account_repository = new AccountRepository(Account);
    constructor() {}

    async registerAdvisorAccount(input: AdvisorAccountInput): Promise<Account> {
        const { email, password, faculty, is_committee, name, last_name } = input;
        const advisor_profile = new Advisor(name, last_name, faculty, is_committee);
        const advisor_account = new Account(email, password, ERole.ADVISOR);
        advisor_account.is_advisor = advisor_profile;
        return await this.account_repository.save(advisor_account);
    }

    async getAdvisorAccounts(): Promise<Account[]> {
        return await this.account_repository.find('role', ERole.ADVISOR);
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
