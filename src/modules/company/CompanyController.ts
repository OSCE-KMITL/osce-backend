import { CompanyInput } from './args/CompanyInput';
import { Company } from './../../entity/Company';
import { CompanyService } from './CompanyService';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';

@Resolver()
@Service()
export class CompanyController {
    constructor(private readonly CompanyService: CompanyService) {}

    @Query(() => [Company], { nullable: 'items' })
    async getCompanys(): Promise<Company[] | null> {
        return this.CompanyService.getAllCompany();
    }

    @Query(() => Company, { nullable: true })
    async getCompany(@Arg('with_key') constraints_key: GetWithKeyInput): Promise<Company | null> {
        return this.CompanyService.getOneBy(constraints_key);
    }

    @Mutation(() => Company)
    async createCompany(@Arg('company_info') company_info: CompanyInput): Promise<Company | null> {
        return this.CompanyService.createCompany(company_info);

    }
}
