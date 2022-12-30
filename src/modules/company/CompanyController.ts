import { CompanyInput, UpdateCompanyInput } from './args/CompanyInput';
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
    async getAllCompanys(): Promise<Company[] | null> {
        return this.CompanyService.getAllCompany();
    }

    @Query(() => Company, { nullable: true })
    async getCompanyById(@Arg('company_id') company_id: string): Promise<Company | null> {
        return this.CompanyService.getById(company_id);
    }

    @Query(() => Company, { nullable: true })
    async getCompanyByKey(@Arg('with_key') constraints_key: GetWithKeyInput): Promise<Company | null> {
        return this.CompanyService.getOneBy(constraints_key);
    }

    @Mutation(() => Company)
    async createCompany(@Arg('company_info') company_info: CompanyInput): Promise<Company | null> {
        return this.CompanyService.createCompany(company_info);
    }

    @Mutation(() => Company, { nullable: true })
    async updateCompany(@Arg('update_input') update_input: UpdateCompanyInput): Promise<Company | null> {
        return this.CompanyService.updateCompany(update_input);
    }

    @Mutation(() => Company, { nullable: true })
    async deleteCompany(@Arg('delete_by_id') delete_by_id: string): Promise<Company | null> {
        return this.CompanyService.deleteCompany(delete_by_id);
    }
}
