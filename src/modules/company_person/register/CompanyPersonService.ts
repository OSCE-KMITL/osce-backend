import { AccountRepository } from '../../account/AccountRepository';
import {
    CompanyPersonInput,
    CompanyPersonWithCompanyNameInput,
    UpdateCompanyPersonInput,
} from '../args/CompanyPersonInput';
import { CompanyPerson } from '../../../entity/CompanyPerson';
import { CompanyPersonRepository } from './CompanyPersonRepository';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { RoleOption } from '../../../shared/types/Roles';
import { CompanyRepository } from '../../company/CompanyRepository';
import { Company } from '../../../entity/Company';
import { hashedPassword } from '../../../utils/hash-password';
import { sendEmail } from '../../email-service/EmailService';
import * as crypto from 'crypto';

// input = full_name: string, job_title: string, is_coordinator: boolean
@Service()
export class CompanyPersonService {
    private readonly company_person_repository: CompanyPersonRepository;
    private readonly account_repository: AccountRepository;
    private readonly company_repository: CompanyRepository;

    constructor() {
        this.company_person_repository = new CompanyPersonRepository(CompanyPerson);
        this.account_repository = new AccountRepository(Account);
        this.company_repository = new CompanyRepository(Company);
    }

    async registerCompanyPersonAccount(input: CompanyPersonInput): Promise<Account> {
        const { email, password, full_name, job_title, is_coordinator, company_id, phone_number } = input;
        const company = await this.company_repository.findOne('id', company_id.trim().toLowerCase());
        if (!company) throw new Error('ไม่พบบริษัทในระบบ');

        const saved_company_person = new CompanyPerson(
            full_name.trim().toLowerCase(),
            job_title.trim().toLowerCase(),
            is_coordinator,
            email.trim().toLowerCase(),
            phone_number.trim(),
        );

        const hashed_password = await hashedPassword(password);
        const company_person_account = new Account(email.trim().toLowerCase(), hashed_password, RoleOption.COMPANY);
        company_person_account.is_company = saved_company_person;

        if (!company.company_persons) {
            company.company_persons = [];
        }

        company.company_persons.push(await this.company_person_repository.save(saved_company_person));
        await this.company_repository.save(company);

        return await this.account_repository.save(company_person_account);
    }

    async registerCompanyPersonAccountByCommittee(input: CompanyPersonWithCompanyNameInput): Promise<Account> {
        const { email, full_name, job_title, is_coordinator, company_name, phone_number } = input;

        const already_exist_email = await this.account_repository.findOne('email', email.trim().toLocaleLowerCase());

        if (already_exist_email) throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว');

        const company = await this.company_repository.findOne('name_eng', company_name.trim().toLowerCase());
        let new_company: Company;

        if (!company) {
            new_company = new Company('-', company_name.trim().toLocaleLowerCase(), '-', '', '', '-', '', '-', '-', '-');
        } else {
            new_company = company;
        }

        const saved_company_person = new CompanyPerson(
            full_name.trim().toLowerCase(),
            job_title.trim().toLowerCase(),
            is_coordinator,
            email.trim().toLowerCase(),
            phone_number.trim(),
        );
        const rand_pass = crypto.randomBytes(6).toString('base64')
        const hashed_password = await hashedPassword(rand_pass);

        const company_person_account = new Account(email.trim().toLowerCase(), hashed_password, RoleOption.COMPANY);
        company_person_account.is_company = saved_company_person;

        if (!new_company.company_persons) {
            new_company.company_persons = [];
        }


        new_company.company_persons.push(await this.company_person_repository.save(saved_company_person));
        await this.company_repository.save(new_company);
        await sendEmail(email.trim().toLowerCase() , rand_pass ,full_name.trim().toLocaleLowerCase())
        return  await this.account_repository.save(company_person_account);

    }

    async getCompanyPersonAccounts(): Promise<Account[]> {
        return await this.account_repository.find('role', RoleOption.COMPANY);
    }

    async getCompanyPersonAccount(id: string): Promise<Account | null> {
        return await this.account_repository.findOne('id', id);
    }

    async deleteCompanyPersonAccount(id: string) {
        const already_account = await this.account_repository.findOne('id', id);
        if (!already_account) throw new Error('ไม่พบผู้ใช้ที่ต้องการจะลบ');

        const company_person_id = already_account.is_company.company_person_id;
        const company_person = await this.company_person_repository.findOne('company_person_id', company_person_id);
        if (!company_person) throw new Error('something went wrong !');

        const deleted_company_person = await this.company_person_repository.delete(company_person);
        if (!deleted_company_person) throw new Error('something went wrong !');

        return await this.account_repository.delete(already_account);
    }

    async updateCompanyPerson(update_input: UpdateCompanyPersonInput) {
        const { id, full_name, job_title, is_coordinator, email, phone_number } = update_input;
        const update_company_person = await this.company_person_repository.findOne('company_person_id', id);
        if (!update_company_person) throw new Error('ไม่พบบุคลากรบริษัทที่จะแก้ไข');

        update_company_person.full_name = !!full_name ? full_name.trim().toLowerCase() : update_company_person.full_name;
        update_company_person.job_title = !!job_title ? job_title.trim().toLowerCase() : update_company_person.job_title;
        update_company_person.is_coordinator = !!is_coordinator ? is_coordinator : update_company_person.is_coordinator;
        update_company_person.email = !!email ? email : update_company_person.email;
        update_company_person.phone_number = !!phone_number ? phone_number : update_company_person.phone_number;

        return await this.company_person_repository.save(update_company_person);
    }
}
