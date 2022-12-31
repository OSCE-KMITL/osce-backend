import { CompanyPerson } from './../../../entity/CompanyPerson';
import { CompanyPersonInput, UpdateCompanyPersonInput } from './../args/CompanyPersonInput';
import { CompanyPersonService } from './CompanyPersonService';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';

@Service()
@Resolver()
export class CompanyPersonController {
    constructor(private readonly company_person_account_service: CompanyPersonService) {}

    @Mutation(() => Account, { nullable: false })
    async registerCompanyPerson(@Arg('CompanyPersonAccountInfo') input: CompanyPersonInput): Promise<Account> {
        return this.company_person_account_service.registerCompanyPersonAccount(input);
    }

    @Mutation(() => CompanyPerson, { nullable: true })
    async updateCompanyPerson(@Arg('update_input') update_input: UpdateCompanyPersonInput): Promise<CompanyPerson | null> {
        return this.company_person_account_service.updateCompanyPerson(update_input);
    }
}
