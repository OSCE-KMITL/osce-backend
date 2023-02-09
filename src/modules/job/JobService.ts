import { CompanyRepository } from './../company/CompanyRepository';
import { Company } from './../../entity/Company';
import { JobInputByCommittee, UpdateJobInput, JobInputByCompany } from './args/JobInput';
import { Job } from './../../entity/Job';
import { JobRepository } from './JobRepository';
import { Service } from 'typedi';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { AdvisorRepository } from '../advisor/AdvisorRepository';
import { Advisor } from '../../entity/Advisor';
import { Account } from '../../entity/Account';
import { AccountRepository } from '../account/AccountRepository';
import { RoleOption } from '../../shared/types/Roles';
import { Arg, Args, Ctx } from 'type-graphql';

@Service()
export class JobService {
    constructor(
        private readonly job_repository = new JobRepository(Job),
        private readonly account_repository = new AccountRepository(Account),
        private readonly advisor_repository = new AdvisorRepository(Advisor),
        private readonly company_repository = new CompanyRepository(Company)
    ) {}

    async getAllJob() {
        const result = await this.job_repository.find();
        return result;
    }

    async getById(job_id: string) {
        const job_data = await this.job_repository.findOne('id', job_id);
        if (!job_data) throw new Error('ไม่พบงานที่ค้นหา');
        return job_data;
    }

    async createJobByCommittee(job_info: JobInputByCommittee, account_id: string) {
        const { job_title, compensation, coop301_fileurl, limit, nature_of_work, project_topic, required_major, required_skills, welfare, company_id } =
            job_info;
        console.log(company_id);
        if (company_id) {
            const account = await this.account_repository.findOne('id', account_id);

            if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
            if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

            const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
            if (!company) throw new Error('ไม่พบบริษัท');

            if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
            if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
            if (coop301_fileurl?.length > 2000) throw new Error('ไฟล์URLมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
            if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
            if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
            if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');

            const saved_job = await this.job_repository.save(
                new Job(
                    job_title?.trim(),
                    required_major?.trim(),
                    project_topic?.trim(),
                    nature_of_work?.trim(),
                    required_skills?.trim(),
                    limit?.trim(),
                    welfare?.trim(),
                    compensation?.trim(),
                    coop301_fileurl?.trim()
                )
            );
            company.job.push(await this.job_repository.save(saved_job));
            await this.company_repository.save(company);

            return saved_job;
        } else {
            throw new Error('committee create job error');
        }
    }

    async createJobByCompany(job_info: JobInputByCompany, account_id: string) {
        const { job_title, compensation, coop301_fileurl, limit, nature_of_work, project_topic, required_major, required_skills, welfare } = job_info;
        const account = await this.account_repository.findOne('id', account_id);

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

        const company_id = (await account.is_company.company_id).id;
        const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
        if (!company) throw new Error('ไม่พบบริษัท');

        if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
        if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (coop301_fileurl?.length > 2000) throw new Error('ไฟล์URLมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
        if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
        if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        const saved_job = await this.job_repository.save(
            new Job(
                job_title?.trim(),
                required_major?.trim(),
                project_topic?.trim(),
                nature_of_work?.trim(),
                required_skills?.trim(),
                limit?.trim(),
                welfare?.trim(),
                compensation?.trim(),
                coop301_fileurl?.trim()
            )
        );

        company.job.push(await this.job_repository.save(saved_job));
        await this.company_repository.save(company);

        return saved_job;
    }

    async deleteJob(job_id: string, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');

        if (account.role !== RoleOption.COMMITTEE && account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถลบงานได้');

        const already_job = await this.job_repository.findOne('id', job_id);
        if (!already_job) throw new Error('ไม่พบข้อมูลงานที่จะลบ');
        return await this.job_repository.delete(already_job);
    }

    async updateJob(update_input: UpdateJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');

        if (account.role !== RoleOption.COMMITTEE && account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถแก้ไขงานได้');

        const { id, job_title, compensation, coop301_fileurl, limit, nature_of_work, project_topic, required_major, required_skills, welfare } = update_input;
        const update_job = await this.job_repository.findOne('id', id);
        if (!update_job) throw new Error('ไม่พบงานที่จะแก้ไข');

        update_job.job_title = !!job_title ? job_title.trim() : update_job.job_title;
        update_job.compensation = !!compensation ? compensation.trim() : update_job.compensation;
        update_job.coop301_fileurl = !!coop301_fileurl ? coop301_fileurl.trim() : update_job.coop301_fileurl;
        update_job.limit = !!limit ? limit.trim() : update_job.limit;
        update_job.nature_of_work = !!nature_of_work ? nature_of_work.trim() : update_job.nature_of_work;
        update_job.project_topic = !!project_topic ? project_topic.trim() : update_job.project_topic;
        update_job.required_major = !!required_major ? required_major.trim() : update_job.required_major;
        update_job.required_skills = !!required_skills ? required_skills.trim() : update_job.required_skills;
        update_job.welfare = !!welfare ? welfare.trim() : update_job.welfare;

        return await this.job_repository.save(update_job);
    }
}
