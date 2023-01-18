import { AppContext } from './../../shared/types/context-types';
import { RoleOption } from './../../shared/types/Roles';
import { CompanyInput, UpdateCompanyInput } from './args/CompanyInput';
import { Company } from '../../entity/Company';
import { CompanyService } from './CompanyService';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { useAuthorization } from '../../middleware/useAuthorization';

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

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => Company, { nullable: true })
    async createCompany(@Arg('company_info') company_info: CompanyInput, @Ctx() { req }: AppContext): Promise<Company | null> {
        const { user_id } = req;
        return this.company_service.createCompany(company_info, user_id!);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE, RoleOption.COMPANY]))
    @Mutation(() => Company, { nullable: true })
    async updateCompany(@Arg('update_input') update_input: UpdateCompanyInput, @Ctx() { req }: AppContext): Promise<Company | null> {
        const { user_id } = req;
        return this.company_service.updateCompany(update_input, user_id!);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => Company, { nullable: true })
    async deleteCompany(@Arg('delete_by_id') delete_by_id: string, @Ctx() { req }: AppContext): Promise<Company | null> {
        const { user_id } = req;
        return this.company_service.deleteCompany(delete_by_id, user_id!);
    }
}
