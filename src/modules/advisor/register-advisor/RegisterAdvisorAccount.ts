import { Arg, Mutation, Resolver } from 'type-graphql';
import { AdvisorAccountService } from './AdvisorAccountService';
import { AdvisorAccountInput } from './input/AdvisorAccountInput';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';

@Service()
@Resolver()
export class RegisterAdvisorAccount {
    constructor(private readonly advisor_account_service: AdvisorAccountService) {}

    @Mutation(() => Account, { nullable: false })
    async registerAdvisor(@Arg('advisorAccountInfo') input: AdvisorAccountInput): Promise<Account> {
        return this.advisor_account_service.registerAdvisorAccount(input);
    }
}
