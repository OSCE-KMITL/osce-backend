import { CompanyPerson } from './../../entity/CompanyPerson';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AccountService } from './AccountService';
import { Service } from 'typedi';
import { Account } from '../../entity/Account';
import { AdvisorAccountService } from '../advisor/register-advisor/AdvisorAccountService';
import { Advisor } from '../../entity/Advisor';
import { UpdateAdvisorInput } from '../advisor/register-advisor/input/AdvisorAccountInput';
import { CompanyPersonService } from '../company_person/register/CompanyPersonService';

@Resolver()
@Service()
export class AccountController {
    constructor(private readonly account_service: AccountService, private readonly advisor_account_service: AdvisorAccountService, private readonly company_person_account_service: CompanyPersonService) {}

    @Query(() => [Account], { nullable: 'items' })
    async getAccounts(): Promise<Account[] | null> {
        return await this.account_service.getAccounts();
    }

    @Query(() => Account, { nullable: true })
    async getAccount(@Arg('account_id') id: string): Promise<Account | null> {
        return await this.account_service.getAccount(id);
    }

    @Query(() => [Account], { nullable: 'items' })
    async getAdvisorAccounts(): Promise<Account[] | null> {
        return await this.advisor_account_service.getAdvisorAccounts();
    }

    @Query(() => Account, { nullable: true })
    async getAdvisorAccount(@Arg('advisorId') id: string): Promise<Account | null> {
        return await this.advisor_account_service.getAdvisorAccount(id);
    }
    @Mutation(() => Advisor, { nullable: false })
    updateAccount(@Arg('updateInfo') updateInfo: UpdateAdvisorInput): Promise<Advisor> {
        throw new Error('this method not implemented');
    }

    @Mutation(() => Account, { nullable: true })
    //  id จะไม่ return ค่า ถ้าลบไปแล้ว , ระวังตอนไปใช้ใน client-side
    async deleteAdvisorAccount(@Arg('id') id: string): Promise<Account | null> {
        return await this.advisor_account_service.deleteAdvisorAccount(id);
    }

    @Mutation(() => Account, { nullable: true })
    async deleteCompanyPersonAccount(@Arg('id') id: string): Promise<Account | null> {
        return await this.company_person_account_service.deleteCompanyPersonAccount(id);
    }

    @Query(() => [Account], { nullable: 'items' })
    async getCompanyPersonAccounts(): Promise<Account[] | null> {
        return this.company_person_account_service.getCompanyPersonAccounts();
    }

    @Query(() => Account, { nullable: true })
    async getCompanyPersonAccount(@Arg('account_id') id: string): Promise<Account | null> {
        return await this.company_person_account_service.getCompanyPersonAccount(id);
    }

    
}
