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
        const cleaned_name = name.trim().toLowerCase();
        const cleaned_address = address.trim().toLowerCase();
        const cleaned_phone_number = phone_number.trim().toLowerCase();
        const cleaned_website_url = website_url.trim().toLowerCase();
        const cleaned_business_type = business_type.trim().toLowerCase();

        const saved_company = await this.company_repository.save(
            new Company(cleaned_name, cleaned_address, cleaned_phone_number, cleaned_website_url, cleaned_business_type)
        );
        return saved_company;
    }

    async getAllCompany() {
        return await this.company_repository.find();
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.company_repository.findOne(target, value);
    }

    async updateCompany(update_input: UpdateCompanyInput) {
        const { id, name, address, phone_number, website_url, business_type } = update_input;
        const update_company = await this.company_repository.findOne('id', id);
        if (!update_company) throw new Error('ไม่พบบริษัทที่จะแก้ไข');

        const cleaned_name = name.trim().toLowerCase();
        const cleaned_address = address.trim().toLowerCase();
        const cleaned_phone_number = phone_number.trim().toLowerCase();
        const cleaned_website_url = website_url.trim().toLowerCase();
        const cleaned_business_type = business_type.trim().toLowerCase();

        update_company.name = !!cleaned_name ? cleaned_name : update_company.name;
        update_company.address = !!cleaned_address ? cleaned_address : update_company.address;
        update_company.phone_number = !!cleaned_phone_number ? cleaned_phone_number : update_company.phone_number;
        update_company.website_url = !!cleaned_website_url ? cleaned_website_url : update_company.website_url;
        update_company.business_type = !!cleaned_business_type ? cleaned_business_type : update_company.business_type;

        return await this.company_repository.save(update_company);
    }

    async deleteCompany(constraints_key: GetWithKeyInput) {
        const { target, value } = constraints_key;
        const company_data = await this.company_repository.findOne(target, value);
        if (!company_data) throw new Error('ไม่พบข้อมูลบริษัทที่จะลบ');
        return await this.company_repository.delete(company_data);
    }
}
