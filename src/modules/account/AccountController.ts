import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AccountService } from './AccountService';
import { Service } from 'typedi';
import { Account } from '../../entity/Account';
import { AdvisorAccountService } from '../advisor/register-advisor/AdvisorAccountService';
import { UpdateAdvisorArgs } from '../advisor/register-advisor/input/AdvisorAccountInput';
import { CompanyPersonService } from '../company_person/register/CompanyPersonService';
import { useAuthorization } from '../../middleware/useAuthorization';
import { RoleOption } from '../../shared/types/Roles';
import { AppContext } from '../../shared/types/context-types';
import { Advisor } from '../../entity/Advisor';

@Resolver()
@Service()
export class AccountController {
    constructor(
        private readonly account_service: AccountService,
        private readonly advisor_account_service: AdvisorAccountService,
        private readonly company_person_account_service: CompanyPersonService
    ) {}

    @Query(() => [Account], { nullable: 'items' })
    async getAccounts(): Promise<Account[] | null> {
        return await this.account_service.getAccounts();
    }

    @Query(() => Account, { nullable: true })
    async getAccount(@Arg('account_id') id: string): Promise<Account | null> {
        return await this.account_service.getAccount(id);
    }

    @Query(() => [Account], { nullable: 'items' })
    async getAdvisorAccounts(@Ctx() { req }: AppContext): Promise<Account[] | null | undefined> {
        const { user_id } = req;
        if (!user_id) throw new Error('Not Authoriezd');
        return await this.advisor_account_service.getAdvisorAccounts(user_id);
    }

    @Query(() => Account, { nullable: true })
    async getAdvisorAccount(@Arg('advisor_id') id: string): Promise<Account | null> {
        return await this.advisor_account_service.getAdvisorAccount(id);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE, RoleOption.ADVISOR]))
    @Mutation(() => Account, { nullable: false })
    updateAdvisorAccount(@Arg('updateInfo') payload: UpdateAdvisorArgs): Promise<Account | null | undefined> {
        try {
            return this.advisor_account_service.updateAdvisorAccount(payload);
        } catch (e) {
            throw e;
        }
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

    @Query(() => Advisor, { nullable: true })
    //  id จะไม่ return ค่า ถ้าลบไปแล้ว , ระวังตอนไปใช้ใน client-side
    async getAdvisor(@Arg('id') id: string): Promise<Advisor | null | undefined> {
        return await this.advisor_account_service.getAdvisor(id);
    }
}
