import { Advisor } from '../../../entity/Advisor';
import { AdvisorAccountInput } from '../input/AdvisorAccountInput';
import { AdvisorRepository } from './AdvisorRepository';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { ERole } from '../../../shared/types/Roles';
import { AccountRepository } from '../../AccountRepository';

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
}
