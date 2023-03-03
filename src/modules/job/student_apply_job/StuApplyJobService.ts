import { JobStatus } from './../../../shared/types/JobStatus';
import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { Job } from './../../../entity/Job';
import { JobRepository } from './../../job/JobRepository';
import { RoleOption } from './../../../shared/types/Roles';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentApplyJobRepository } from './StuApplyJobRepository';
import { StudentRegisterRepository } from '../../student/register/StudentRegisterRepository';
import { StudentApplyJobInput } from '../../student/args/StudentRegisterInput';
import { EditJobStateInput } from './args/StuApplyJobInput';

@Service()
export class StuApplyJobService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly job_repository = new JobRepository(Job);
    private readonly student_apply_job_repository = new StudentApplyJobRepository(StudentApplyJob);

    constructor() {}
    async applyJob(apply_info: StudentApplyJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id } = apply_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.STUDENT) throw new Error('นักศึกษาเท่านั้นที่สามารถสมัครงานได้');

        const job = await this.job_repository.findOne('id', job_id);
        if (!job) throw new Error('ไม่พบงานที่เปิดรับ');

        const student_id = account.is_student.student_id;
        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        // check duplicate job applying
        const job_in_stu: string[] = await student.student_apply_job.map((i) => i.job_id.toString());
        if (job_in_stu.includes(job_id)) {
            throw new Error('ไม่สามารถสมัครงานได้ เนื่องจากเคยสมัครงานนี้แล้ว');
        }

        // check job limit apply
        if (job_in_stu.length === 5) {
            throw new Error('ไม่สามารถสมัครพร้อมกันเกิน 5 งาน');
        }

        const studnet_apply_job = new StudentApplyJob(student_id, job_id, JobStatus.STUDENTAPPLIED);
        const saved_job = await this.student_apply_job_repository.save(studnet_apply_job);

        try {
            job.student_apply_job.push(saved_job);
            await this.job_repository.save(job);
        } catch (error) {
            console.log(error);
        }

        try {
            student.student_apply_job.push(saved_job);
        } catch (error) {
            console.log(error);
        }

        return await this.student_repository.save(student);
    }

    async cancelApply(cancel_apply_info: StudentApplyJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id } = cancel_apply_info; // job_id = id in table student_apply_job
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.STUDENT) throw new Error('นักศึกษาเท่านั้นที่สามารถยกเลิกสมัครงานได้');

        const student_id = account.is_student.student_id;
        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกสมัคร');
        }

        if (already__apply_job?.job_status === JobStatus.STUDENTAPPLIED) {
            return await this.student_apply_job_repository.delete(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกสมัครงานได้ เนื่องจากบริษัทตอบรับงานแล้ว');
        }
    }

    async companyApprove(company_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = company_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY && account.role !== RoleOption.COMMITTEE) throw new Error('บริษัทหรือกรรมการเท่านั้นที่สามารถตอบรับงานได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะตอบรับ');
        }

        const limit = (await already__apply_job.job).limit;
        const stu_applied_obj = (await already__apply_job.job).student_apply_job.filter((i) => i.job_status === JobStatus.COMPANYAPPROVE);
        if (stu_applied_obj.length === parseInt(limit)) {
            throw new Error('ไม่สามารถตอบรับได้ เนื่องจากตอบรับผู้สมัครครบจำนวนแล้ว');
        }

        if (already__apply_job?.job_status === JobStatus.STUDENTAPPLIED) {
            already__apply_job.job_status = JobStatus.COMPANYAPPROVE;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถตอบรับงานได้');
        }
    }

    async undoCompanyApprove(company_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = company_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY && account.role !== RoleOption.COMMITTEE)
            throw new Error('บริษัทหรือกรรมการเท่านั้นที่สามารถยกเลิกการตอบรับงานได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกการตอบรับ');
        }

        if (already__apply_job?.job_status === JobStatus.COMPANYAPPROVE) {
            already__apply_job.job_status = JobStatus.STUDENTAPPLIED;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกการตอบรับงานได้');
        }
    }

    async companyDisapprove(company_disapprove_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = company_disapprove_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY && account.role !== RoleOption.COMMITTEE) throw new Error('บริษัทหรือกรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);
        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะปฏิเสธการตอบรับ');
        }

        if (already__apply_job?.job_status === JobStatus.STUDENTAPPLIED) {
            already__apply_job.job_status = JobStatus.COMPANYCANCEL;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถปฏิเสธการตอบรับงานได้');
        }
    }

    async undoCompanyDisapprove(company_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = company_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY && account.role !== RoleOption.COMMITTEE) throw new Error('บริษัทหรือกรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกการปฏิเสธ');
        }

        if (already__apply_job?.job_status === JobStatus.COMPANYCANCEL) {
            already__apply_job.job_status = JobStatus.STUDENTAPPLIED;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกการปฏิเสธได้');
        }
    }
}
