import { FileUploadRepository } from './../file_upload/FileUploadRepository';
import { FileUpload } from './../../entity/FileUpload';
import { createWriteStream } from 'fs';
import { Upload } from './../../shared/types/Upload';
import { CompanyRepository } from './../company/CompanyRepository';
import { Company } from './../../entity/Company';
import { JobInputByCommittee, UpdateJobInput, JobInputByCompany } from './args/JobInput';
import { Job } from './../../entity/Job';
import { JobRepository } from './JobRepository';
import { Service } from 'typedi';
import { Account } from '../../entity/Account';
import { AccountRepository } from '../account/AccountRepository';
import { RoleOption } from '../../shared/types/Roles';
import path from 'path';
import { generateRandomString } from '../../utils/random-string';
import { PORT } from '../../shared/constants';

@Service()
export class JobService {
    constructor(
        private readonly job_repository = new JobRepository(Job),
        private readonly account_repository = new AccountRepository(Account),
        private readonly company_repository = new CompanyRepository(Company),
        private readonly file_upload_repository = new FileUploadRepository(FileUpload)
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

    async createJobByCommittee(job_info: JobInputByCommittee, account_id: string, file: Upload) {
        const {
            job_title,
            compensation,
            limit,
            nature_of_work,
            project_topic,
            required_major,
            required_skills,
            welfare,
            company_id,
            internship_period,
            work_period,
            coordinator_name,
            coordinator_job_title,
            coordinator_email,
            coordinator_phone_number,
            supervisor_name,
            supervisor_job_title,
            supervisor_email,
            supervisor_phone_number,
        } = job_info;
        if (company_id) {
            const account = await this.account_repository.findOne('id', account_id);

            if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
            if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

            const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
            if (!company) throw new Error('ไม่พบบริษัท');

            if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
            if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
            if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
            if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
            if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
            if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
            if (internship_period?.length > 100) throw new Error('ระยะเวลาฝึกงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
            if (work_period?.length > 100) throw new Error('ช่วงเวลาปฏิบัติงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
            if (coordinator_name?.length > 200) throw new Error('ชื่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_email?.length > 200) throw new Error('Email ผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
            if (supervisor_name?.length > 200) throw new Error('ชื่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_email?.length > 200) throw new Error('Email ผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');

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
                    internship_period?.trim(),
                    work_period?.trim(),
                    coordinator_name?.trim(),
                    coordinator_job_title?.trim(),
                    coordinator_email?.trim(),
                    coordinator_phone_number?.trim(),
                    supervisor_name?.trim(),
                    supervisor_job_title?.trim(),
                    supervisor_email?.trim(),
                    supervisor_phone_number?.trim()
                )
            );
            company.job.push(await this.job_repository.save(saved_job));
            await this.company_repository.save(company);

            // if(file){
            //     const upload_service = new FileUploadController(new FileUploadService());
            //     upload_service.uploadFile(file)
            // }

            const job = await this.job_repository.findOne('id', saved_job.id);
            if (!job) throw new Error('ไม่พบงานที่เปิดรับ');
            if (file) {
                const { createReadStream, filename, mimetype, encoding } = await file;
                const { ext } = path.parse(filename);
                const year_now = new Date().getFullYear().toString();
                const random_name = generateRandomString(12) + ext;
                const original_name = filename;
                const current_name = year_now + '_' + 'job_file' + '_' + saved_job.id + '_' + random_name;
                const url = `http://localhost:${PORT}/files/${current_name}`;

                try {
                    createReadStream().pipe(createWriteStream(__dirname + `/../../../public/files/${current_name}`));
                    job.file_upload.push(await this.file_upload_repository.save(new FileUpload(original_name, current_name, url)));
                    await this.job_repository.save(job);
                } catch (error) {
                    throw new Error('error save file');
                }
            }

            return saved_job;
        } else {
            throw new Error('committee create job error');
        }
    }

    async createJobByCommitteeNofile(job_info: JobInputByCommittee, account_id: string) {
        const {
            job_title,
            compensation,
            limit,
            nature_of_work,
            project_topic,
            required_major,
            required_skills,
            welfare,
            company_id,
            internship_period,
            work_period,
            coordinator_name,
            coordinator_job_title,
            coordinator_email,
            coordinator_phone_number,
            supervisor_name,
            supervisor_job_title,
            supervisor_email,
            supervisor_phone_number,
        } = job_info;
        if (company_id) {
            const account = await this.account_repository.findOne('id', account_id);

            if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
            if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

            const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
            if (!company) throw new Error('ไม่พบบริษัท');

            if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
            if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
            if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
            if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
            if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
            if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
            if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
            if (internship_period?.length > 100) throw new Error('ระยะเวลาฝึกงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
            if (work_period?.length > 100) throw new Error('ช่วงเวลาปฏิบัติงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
            if (coordinator_name?.length > 200) throw new Error('ชื่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_email?.length > 200) throw new Error('Email ผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (coordinator_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
            if (supervisor_name?.length > 200) throw new Error('ชื่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_email?.length > 200) throw new Error('Email ผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
            if (supervisor_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');

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
                    internship_period?.trim(),
                    work_period?.trim(),
                    coordinator_name?.trim(),
                    coordinator_job_title?.trim(),
                    coordinator_email?.trim(),
                    coordinator_phone_number?.trim(),
                    supervisor_name?.trim(),
                    supervisor_job_title?.trim(),
                    supervisor_email?.trim(),
                    supervisor_phone_number?.trim()
                )
            );
            company.job.push(await this.job_repository.save(saved_job));
            await this.company_repository.save(company);

            return saved_job;
        } else {
            throw new Error('committee create job error');
        }
    }

    async createJobByCompany(job_info: JobInputByCompany, account_id: string, file: Upload) {
        const {
            job_title,
            compensation,
            limit,
            nature_of_work,
            project_topic,
            required_major,
            required_skills,
            welfare,
            internship_period,
            work_period,
            coordinator_name,
            coordinator_job_title,
            coordinator_email,
            coordinator_phone_number,
            supervisor_name,
            supervisor_job_title,
            supervisor_email,
            supervisor_phone_number,
        } = job_info;
        const account = await this.account_repository.findOne('id', account_id);

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

        const company_id = (await account.is_company.company_id).id;
        const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
        if (!company) throw new Error('ไม่พบบริษัท');

        if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
        if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
        if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
        if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (internship_period?.length > 100) throw new Error('ระยะเวลาฝึกงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (work_period?.length > 100) throw new Error('ช่วงเวลาปฏิบัติงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (coordinator_name?.length > 200) throw new Error('ชื่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_email?.length > 200) throw new Error('Email ผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (supervisor_name?.length > 200) throw new Error('ชื่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_email?.length > 200) throw new Error('Email ผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');

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
                internship_period?.trim(),
                work_period?.trim(),
                coordinator_name?.trim(),
                coordinator_job_title?.trim(),
                coordinator_email?.trim(),
                coordinator_phone_number?.trim(),
                supervisor_name?.trim(),
                supervisor_job_title?.trim(),
                supervisor_email?.trim(),
                supervisor_phone_number?.trim()
            )
        );

        company.job.push(await this.job_repository.save(saved_job));
        await this.company_repository.save(company);

        const job = await this.job_repository.findOne('id', saved_job.id);
        if (!job) throw new Error('ไม่พบงานที่เปิดรับ');
        if (file) {
            const { createReadStream, filename, mimetype, encoding } = await file;
            const { ext } = path.parse(filename);
            const year_now = new Date().getFullYear().toString();
            const random_name = generateRandomString(12) + ext;
            const original_name = filename;
            const current_name = year_now + '_' + 'job_file' + '_' + saved_job.id + '_' + random_name;
            const url = `http://localhost:${PORT}/files/${current_name}`;

            try {
                createReadStream().pipe(createWriteStream(__dirname + `/../../../public/files/${current_name}`));
                job.file_upload.push(await this.file_upload_repository.save(new FileUpload(original_name, current_name, url)));
                await this.job_repository.save(job);
            } catch (error) {
                throw new Error('error save file');
            }
        }

        return saved_job;
    }

    async createJobByCompanyNoFile(job_info: JobInputByCompany, account_id: string) {
        const {
            job_title,
            compensation,
            limit,
            nature_of_work,
            project_topic,
            required_major,
            required_skills,
            welfare,
            internship_period,
            work_period,
            coordinator_name,
            coordinator_job_title,
            coordinator_email,
            coordinator_phone_number,
            supervisor_name,
            supervisor_job_title,
            supervisor_email,
            supervisor_phone_number,
        } = job_info;
        const account = await this.account_repository.findOne('id', account_id);

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY) throw new Error('กรรมการและบริษัทเท่านั้นที่สามารถเพิ่มงานที่เปิดรับได้');

        const company_id = (await account.is_company.company_id).id;
        const company = await this.company_repository.findOne('id', company_id?.trim().toLowerCase());
        if (!company) throw new Error('ไม่พบบริษัท');

        if (job_title?.length > 255) throw new Error('ตำแหน่งงานต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
        if (compensation?.length > 20) throw new Error('ค่าตอบแทนต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (limit?.length > 3) throw new Error('จำนวนที่เปิดรับต้องมีตัวอักษรไม่เกิน 3 ตัวอักษร');
        if (nature_of_work?.length > 2000) throw new Error('ลักษณะงานต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (project_topic?.length > 500) throw new Error('หัวข้อโครงงานสหกิจศึกษาต้องมีตัวอักษรไม่เกิน 500 ตัวอักษร');
        if (required_major?.length > 1000) throw new Error('สาขาที่ต้องการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (required_skills?.length > 2000) throw new Error('ความสามารถที่นักศึกษาต้องมี ต้องมีตัวอักษรไม่เกิน 2000 ตัวอักษร');
        if (welfare?.length > 1000) throw new Error('สวัสดิการต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        if (internship_period?.length > 100) throw new Error('ระยะเวลาฝึกงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (work_period?.length > 100) throw new Error('ช่วงเวลาปฏิบัติงานต้องมีตัวอักษรไม่เกิน 100 ตัวอักษร');
        if (coordinator_name?.length > 200) throw new Error('ชื่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_email?.length > 200) throw new Error('Email ผู้ประสานงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (coordinator_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้ประสานงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');
        if (supervisor_name?.length > 200) throw new Error('ชื่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_job_title?.length > 200) throw new Error('ตำแหน่งงานผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_email?.length > 200) throw new Error('Email ผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 200 ตัวอักษร');
        if (supervisor_phone_number?.length > 20) throw new Error('เบอร์ติดต่อผู้นิเทศงานต้องมีตัวอักษรไม่เกิน 20 ตัวอักษร');

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
                internship_period?.trim(),
                work_period?.trim(),
                coordinator_name?.trim(),
                coordinator_job_title?.trim(),
                coordinator_email?.trim(),
                coordinator_phone_number?.trim(),
                supervisor_name?.trim(),
                supervisor_job_title?.trim(),
                supervisor_email?.trim(),
                supervisor_phone_number?.trim()
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

        const {
            id,
            job_title,
            compensation,
            limit,
            nature_of_work,
            project_topic,
            required_major,
            required_skills,
            welfare,
            internship_period,
            work_period,
            coordinator_name,
            coordinator_job_title,
            coordinator_email,
            coordinator_phone_number,
            supervisor_name,
            supervisor_job_title,
            supervisor_email,
            supervisor_phone_number,
        } = update_input;
        const update_job = await this.job_repository.findOne('id', id);
        if (!update_job) throw new Error('ไม่พบงานที่จะแก้ไข');

        update_job.job_title = !!job_title ? job_title.trim() : update_job.job_title;
        update_job.compensation = !!compensation ? compensation.trim() : update_job.compensation;
        update_job.limit = !!limit ? limit.trim() : update_job.limit;
        update_job.nature_of_work = !!nature_of_work ? nature_of_work.trim() : update_job.nature_of_work;
        update_job.project_topic = !!project_topic ? project_topic.trim() : update_job.project_topic;
        update_job.required_major = !!required_major ? required_major.trim() : update_job.required_major;
        update_job.required_skills = !!required_skills ? required_skills.trim() : update_job.required_skills;
        update_job.welfare = !!welfare ? welfare.trim() : update_job.welfare;
        update_job.internship_period = !!internship_period ? internship_period.trim() : update_job.internship_period;
        update_job.work_period = !!work_period ? work_period.trim() : update_job.work_period;
        update_job.coordinator_name = !!coordinator_name ? coordinator_name.trim() : update_job.coordinator_name;
        update_job.coordinator_job_title = !!coordinator_job_title ? coordinator_job_title.trim() : update_job.coordinator_job_title;
        update_job.coordinator_email = !!coordinator_email ? coordinator_email.trim() : update_job.coordinator_email;
        update_job.coordinator_phone_number = !!coordinator_phone_number ? coordinator_phone_number.trim() : update_job.coordinator_phone_number;
        update_job.supervisor_name = !!supervisor_name ? supervisor_name.trim() : update_job.supervisor_name;
        update_job.supervisor_job_title = !!supervisor_job_title ? supervisor_job_title.trim() : update_job.supervisor_job_title;
        update_job.supervisor_email = !!supervisor_email ? supervisor_email.trim() : update_job.supervisor_email;
        update_job.supervisor_phone_number = !!supervisor_phone_number ? supervisor_phone_number.trim() : update_job.supervisor_phone_number;

        return await this.job_repository.save(update_job);
    }
}
