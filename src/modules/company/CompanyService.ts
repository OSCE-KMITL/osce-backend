import { RoleOption } from './../../shared/types/Roles';
import { Account } from './../../entity/Account';
import { AccountRepository } from './../account/AccountRepository';
import { CompanyInput, UpdateCompanyInput } from './args/CompanyInput';
import { Service } from 'typedi';
import { CompanyRepository } from './CompanyRepository';
import { Company } from '../../entity/Company';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
@Service()
export class CompanyService {
    constructor(private readonly company_repository = new CompanyRepository(Company), private readonly account_repository = new AccountRepository(Account)) {}

    async createCompany(company_info: CompanyInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถเพิ่มบริษัทที่ได้');
        const { name_th, name_eng, address, phone_number, website_url, business_type, sub_district, district, province, postal_code } = company_info;

        if (name_th.length > 100) throw new Error('ชื่อต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (name_eng.length > 100) throw new Error('ชื่อต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (address.length > 1000) throw new Error('ที่อยู่ต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (phone_number.length > 20) throw new Error('เบอร์ต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (website_url.length > 500) throw new Error('เบอร์ต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (business_type.length > 200) throw new Error('ประเภทธุรกิจต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (sub_district.length > 200) throw new Error('ตำบล/แขวงต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (district.length > 200) throw new Error('อำเภอ/เขตต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (province.length > 200) throw new Error('จังหวัดต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (postal_code.length > 200) throw new Error('รหัสไปรษณีย์ต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');

        const saved_company = await this.company_repository.save(
            new Company(
                name_th?.trim().toLowerCase(),
                name_eng?.trim().toLowerCase(),
                address?.trim().toLowerCase(),
                sub_district?.trim().toLowerCase(),
                district?.trim().toLowerCase(),
                province?.trim().toLowerCase(),
                postal_code?.trim(),
                phone_number?.trim(),
                website_url?.trim().toLowerCase(),
                business_type?.trim().toLowerCase()
            )
        );
        return saved_company;
    }

    async getAllCompany() {
        return await this.company_repository.find();
    }

    async getById(id: string) {
        const company_data = await this.company_repository.findOne('id', id);
        if (!company_data) throw new Error('ไม่พบบริษัทที่ค้นหา');
        return company_data;
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.company_repository.findOne(target, value);
    }

    async updateCompany(update_input: UpdateCompanyInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE && account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถแก้ไขบริษัทที่ได้');

        const { id, name_th, name_eng, address, sub_district, district, province, postal_code, phone_number, website_url, business_type } = update_input;
        const update_company = await this.company_repository.findOne('id', id);
        if (!update_company) throw new Error('ไม่พบบริษัทที่จะแก้ไข');
        if (name_th.length > 100) throw new Error('ชื่อต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (name_eng.length > 100) throw new Error('ชื่อต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (address.length > 1000) throw new Error('ที่อยู่ต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (phone_number.length > 20) throw new Error('เบอร์ต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (website_url.length > 500) throw new Error('เบอร์ต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (business_type.length > 200) throw new Error('ประเภทธุรกิจต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (sub_district.length > 200) throw new Error('ตำบล/แขวงต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (district.length > 200) throw new Error('อำเภอ/เขตต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (province.length > 200) throw new Error('จังหวัดต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (postal_code.length > 200) throw new Error('รหัสไปรษณีย์ต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');

        update_company.name_th = !!name_th ? name_th.trim().toLowerCase() : update_company.name_th;
        update_company.name_eng = !!name_eng ? name_eng.trim().toLowerCase() : update_company.name_eng;
        update_company.address = !!address ? address.trim().toLowerCase() : update_company.address;
        update_company.phone_number = !!phone_number ? phone_number.trim().toLowerCase() : update_company.phone_number;
        update_company.website_url = !!website_url ? website_url.trim().toLowerCase() : update_company.website_url;
        update_company.business_type = !!business_type ? business_type.trim().toLowerCase() : update_company.business_type;
        update_company.sub_district = !!sub_district ? sub_district.trim().toLowerCase() : update_company.sub_district;
        update_company.district = !!district ? district.trim().toLowerCase() : update_company.district;
        update_company.province = !!province ? province.trim().toLowerCase() : update_company.province;
        update_company.postal_code = !!postal_code ? postal_code.trim() : update_company.postal_code;

        return await this.company_repository.save(update_company);
    }

    async deleteCompany(company_id: string, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถลบบริษัทที่ได้');

        const company_data = await this.company_repository.findOne('id', company_id);
        if (!company_data) throw new Error('ไม่พบข้อมูลบริษัทที่จะลบ');
        return await this.company_repository.delete(company_data);
    }
}
