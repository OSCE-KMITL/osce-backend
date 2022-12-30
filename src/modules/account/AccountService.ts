import { Service } from 'typedi';
import { Account } from '../../entity/Account';
import { AccountRepository } from './AccountRepository';

@Service()
export class AccountService {
    private readonly account_repository = new AccountRepository(Account);

    async getAccounts(): Promise<Account[] | null> {
        return await this.account_repository.find();
    }
    async getAccount(id: string): Promise<Account | null> {
        return await this.account_repository.findOne('id', id);
    }
}