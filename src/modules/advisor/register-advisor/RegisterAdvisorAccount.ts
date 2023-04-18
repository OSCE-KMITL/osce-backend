import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AdvisorAccountService } from './AdvisorAccountService';
import { AdvisorAccountInput } from './input/AdvisorAccountInput';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AppContext } from '../../../shared/types/context-types';

@Service()
@Resolver()
export class RegisterAdvisorAccount {
    constructor(private readonly advisor_account_service: AdvisorAccountService) {}


    @Mutation(() => Account, { nullable: false })
    async registerAdvisor(@Arg('advisorAccountInfo') input: AdvisorAccountInput ,@Ctx(){req}:AppContext ): Promise<Account> {
        const {user_id} = req
        if(!user_id) throw new Error("Your not Authorized ")
        try {
            return this.advisor_account_service.registerAdvisorAccount(input ,user_id);
        }catch (e) {
            throw e
        }
    }
}
