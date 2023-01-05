import { CompanyInput, UpdateCompanyInput } from './args/CompanyInput';
import { Company } from '../../entity/Company';
import { CompanyService } from './CompanyService';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';

@Resolver()
@Service()
export class CompanyController {
    constructor(private readonly company_service: CompanyService) {}

    @Query(() => [Company], { nullable: 'items' })
    async getAllCompanies(): Promise<Company[] | null> {
        return this.company_service.getAllCompany();
    }

    @Query(() => Company, { nullable: true })
    async getCompanyById(@Arg('company_id') company_id: string): Promise<Company | null> {
        return this.company_service.getById(company_id);
    }

    @Query(() => Company, { nullable: true })
    async getCompanyByKey(@Arg('with_key') constraints_key: GetWithKeyInput): Promise<Company | null> {
        return this.company_service.getOneBy(constraints_key);
    }

    @Mutation(() => Company)
    async createCompany(@Arg('company_info') company_info: CompanyInput): Promise<Company | null> {
        return this.company_service.createCompany(company_info);
    }

    @Mutation(() => Company, { nullable: true })
    async updateCompany(@Arg('update_input') update_input: UpdateCompanyInput): Promise<Company | null> {
        return this.company_service.updateCompany(update_input);
    }

    @Mutation(() => Company, { nullable: true })
    async deleteCompany(@Arg('delete_by_id') delete_by_id: string): Promise<Company | null> {
        return this.company_service.deleteCompany(delete_by_id);
    }
}
