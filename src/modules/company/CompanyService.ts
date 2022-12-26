import { CompanyInput } from './args/CompanyInput';
import { Service } from 'typedi';
import { CompanyRepository } from './CompanyRepository';
import { Company } from '../../entity/Company';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
@Service()
export class CompanyService {
    private readonly company_repository: CompanyRepository;
    constructor() {
        this.company_repository = new CompanyRepository(Company);
    }

    async createCompany(company_info: CompanyInput) {
        const { name, address, phone_number, website_url, business_type } = company_info;

        const saved_compay = await this.company_repository.save(new Company(name, address, phone_number, website_url, business_type));
        return saved_compay;
    }

    async getAllCompany() {
        return await this.company_repository.find();
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.company_repository.findOne(target, value);
    }

}
