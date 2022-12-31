import { CompanyInput, UpdateCompanyInput } from './args/CompanyInput';
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

        const saved_company = await this.company_repository.save(
            new Company(
                name.trim().toLowerCase(),
                address.trim().toLowerCase(),
                phone_number.trim(),
                website_url.trim().toLowerCase(),
                business_type.trim().toLowerCase(),
            )
        );
        return saved_company;
    }

    async getAllCompany() {
        return await this.company_repository.find();
    }

    async getById(id: string) {
        const company_data = await this.company_repository.findOne('company_id', id);
        if (!company_data) throw new Error('ไม่พบบริษัทที่ค้นหา');
        return company_data;
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.company_repository.findOne(target, value);
    }

    async updateCompany(update_input: UpdateCompanyInput) {
        const { id, name, address, phone_number, website_url, business_type } = update_input;
        const update_company = await this.company_repository.findOne('company_id', id);
        if (!update_company) throw new Error('ไม่พบบริษัทที่จะแก้ไข');

        update_company.name = !!name ? name.trim().toLowerCase() : update_company.name;
        update_company.address = !!address ? address.trim().toLowerCase() : update_company.address;
        update_company.phone_number = !!phone_number ? phone_number.trim().toLowerCase() : update_company.phone_number;
        update_company.website_url = !!website_url ? website_url.trim().toLowerCase() : update_company.website_url;
        update_company.business_type = !!business_type ? business_type.trim().toLowerCase() : update_company.business_type;

        return await this.company_repository.save(update_company);
    }

    async deleteCompany(company_id: string) {
        const company_data = await this.company_repository.findOne('company_id', company_id);
        if (!company_data) throw new Error('ไม่พบข้อมูลบริษัทที่จะลบ');
        return await this.company_repository.delete(company_data);
    }
}
