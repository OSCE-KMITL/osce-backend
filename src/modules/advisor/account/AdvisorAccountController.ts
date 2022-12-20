import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AdvisorAccountService } from './AdvisorAccountService';
import { Advisor } from '../../../entity/Advisor';
import { AdvisorAccountInput, UpdateAdvisorInput } from '../input/AdvisorAccountInput';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';

@Service()
@Resolver()
export class AdvisorAccountController {
    constructor(private readonly advisor_service: AdvisorAccountService) {}

    @Query(() => [Advisor], { nullable: 'items' })
    async getAllAdvisorAccounts(): Promise<Advisor[] | null> {
        throw new Error('this method not implemented');
    }

    @Query(() => Account, { nullable: true })
    async getAdvisorAccount(@Arg('advisorId') id: string): Promise<Account | null> {
        throw new Error('this method not implemented');
    }

    @Mutation(() => Account, { nullable: false })
    async registerAdvisor(@Arg('advisorInfo') input: AdvisorAccountInput): Promise<Account> {
        return this.advisor_service.registerAdvisorAccount(input);
    }

    @Mutation(() => Advisor, { nullable: false })
    updateAdvisorAccount(@Arg('updateInfo') updateInfo: UpdateAdvisorInput): Promise<Advisor> {
        throw new Error('this method not implemented');
    }

    @Mutation(() => Account, { nullable: true })
    //  _id will be undefined when you're calling. this mutation , Please don't return _id on client side.
    async deleteAdvisorAccount(@Arg('id') id: string): Promise<Account> {
        throw new Error('this method not implemented');
    }
}
