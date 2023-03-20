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
import { EditJobStateInput, AssignJobInput } from './args/StuApplyJobInput';

@Service()
export class StuApplyJobService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly job_repository = new JobRepository(Job);
    private readonly student_apply_job_repository = new StudentApplyJobRepository(StudentApplyJob);

    constructor() {}

    async getAllStudentApplyJob() {
        const result = await this.student_apply_job_repository.find();
        return result;
    }

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

        //เช็คว่าได้รับงานที่กรรมการ approve แล้วหรือยัง
        const student_job = await student?.job;
        if (student_job) throw new Error('ไม่สามารถสมัครงานได้ เนื่องจากได้รับงานแล้ว');

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
        const stu_applied_obj = (await already__apply_job.job).student_apply_job.filter(
            (i) => i.job_status === JobStatus.COMPANYAPPROVE || i.job_status === JobStatus.COMMITTEEAPPROVE
        );
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

    async committeeApproveJob(committee_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = committee_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถอนุมัติงานได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะอนุมัติ');
        }

        const job = await this.job_repository.findOne('id', already__apply_job.job_id);
        if (!job) {
            throw new Error('ไม่พบข้อมูลงาน');
        }

        const student = await this.student_repository.findOne('student_id', already__apply_job.student_id);
        if (!student) {
            throw new Error('ไม่พบข้อมูลนักศึกษา');
        }

        const stu_applied_obj = (await already__apply_job.student)?.student_apply_job?.filter((i) => i.job_status === JobStatus.COMMITTEEAPPROVE);
        if (stu_applied_obj.length >= 1) {
            throw new Error('ไม่สามารถอนุมัติได้ เนื่องจากนักศึกษาได้รับงานแล้ว');
        }

        if (already__apply_job?.job_status === JobStatus.COMPANYAPPROVE) {
            already__apply_job.job_status = JobStatus.COMMITTEEAPPROVE;

            if (!job.students) {
                job.students = [];
            }

            job.students.push(student);
            await this.job_repository.save(job);

            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถอนุมัติงานได้');
        }
    }

    async undoCommitteeApproveJob(undo_committee_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = undo_committee_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกการอนุมัติ');
        }

        const job = await this.job_repository.findOne('id', already__apply_job.job_id);
        if (!job) {
            throw new Error('ไม่พบข้อมูลงาน');
        }

        if (already__apply_job?.job_status === JobStatus.COMMITTEEAPPROVE) {
            already__apply_job.job_status = JobStatus.COMPANYAPPROVE;

            job.students = job.students.filter((i) => i.student_id !== already__apply_job.student_id);
            await this.job_repository.save(job);

            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกการอนุมัติ');
        }
    }

    async committeeDisapprove(committee_disapprove_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = committee_disapprove_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);
        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะปฏิเสธการอนุมัติ');
        }

        if (already__apply_job?.job_status === JobStatus.COMPANYAPPROVE) {
            already__apply_job.job_status = JobStatus.COMMITTEECANCEL;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถปฏิเสธการอนุมัติงานได้');
        }
    }

    async undoCommitteeDisapprove(undo_committee_disapprove_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = undo_committee_disapprove_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกการปฏิเสธ');
        }

        if (already__apply_job?.job_status === JobStatus.COMMITTEECANCEL) {
            already__apply_job.job_status = JobStatus.COMPANYAPPROVE;
            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกการปฏิเสธได้');
        }
    }

    async committeeAssignJob(committee_assign_job_info: AssignJobInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { job_id, student_id } = committee_assign_job_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถอนุมัติงานได้');

        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบข้อมูลนักศึกษา');

        const job = await this.job_repository.findOne('id', job_id);
        if (!job) throw new Error('ไม่พบข้อมูลงานที่เปิดรับ');

        //เช็คว่าเคยได้รับงานอยู่แล้วไหม
        // clear old job
        const student_have_job = student.student_apply_job?.filter((i) => i.job_status === JobStatus.COMMITTEEAPPROVE);
        if (student_have_job.length >= 1) {
            const repo_stu_apply = await this.student_apply_job_repository.findOne('id', student_have_job[0].id);
            if (!repo_stu_apply) {
                throw new Error('ไม่พบข้อมูลการสมัครงาน');
            }
            // repo_stu_apply.job_status = JobStatus.COMMITTEECANCEL;
            // await this.student_apply_job_repository.save(repo_stu_apply);
            this.undoStatusCommitteeApproveJob({ student_apply_job_id: repo_stu_apply.id }, account_id);

            const job_in_stu = await student?.job;
            if (job_in_stu) {
                job.students = job.students.filter((i) => i.student_id.toString() !== student_id.toString());
                //save job repo
                await this.job_repository.save(job);
            }
        }

        // add new job
        let new_student_apply_job = undefined;
        const count_stu_applied = job.student_apply_job.filter((i) => i.job_status === JobStatus.COMMITTEEAPPROVE).length;
        if (count_stu_applied < parseInt(job.limit)) {
            const student_is_applied = student.student_apply_job.filter((i) => i.job_id.toString() === job_id.toString());
            //เช็คว่าเคยสมัครงานนี้หรือยัง
            if (student_is_applied.length > 0) {
                //save stu_apply_job repo
                new_student_apply_job = await this.student_apply_job_repository.findOne('id', student_is_applied[0].id);
                if (!new_student_apply_job) throw new Error('ไม่พบงานที่นักศึกษาสมัคร');
                new_student_apply_job.job_status = JobStatus.COMMITTEEAPPROVE;
            } else {
                job.students.push(student);
                await this.job_repository.save(job);
                return await this.student_apply_job_repository.save(new StudentApplyJob(student_id, job_id, JobStatus.COMMITTEEAPPROVE));
            }
            job.students.push(student);
            //save job repo
            this.job_repository.save(job);
        } else if (count_stu_applied === parseInt(job.limit)) {
            throw new Error('ไม่สามารถกำหนดงานได้ เนื่องจากในงานมีนักศึกษาครบจำนวนที่รับสมัครแล้ว');
        }

        if (!new_student_apply_job) throw new Error('เกิดข้อผิดพลาด');

        return await this.student_apply_job_repository.save(new_student_apply_job);
    }

    async undoStatusCommitteeApproveJob(undo_committee_approve_info: EditJobStateInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { student_apply_job_id } = undo_committee_approve_info;
        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถดำเนินการได้');

        // check id in table student_apply_job
        const already__apply_job = await this.student_apply_job_repository.findOne('id', student_apply_job_id);

        if (!already__apply_job) {
            throw new Error('ไม่พบข้อมูลงานที่จะยกเลิกการอนุมัติ');
        }

        const job = await this.job_repository.findOne('id', already__apply_job.job_id);
        if (!job) {
            throw new Error('ไม่พบข้อมูลงาน');
        }

        if (already__apply_job?.job_status === JobStatus.COMMITTEEAPPROVE) {
            already__apply_job.job_status = JobStatus.COMMITTEECANCEL;

            // job.students = job.students.filter((i) => i.student_id !== already__apply_job.student_id);
            // await this.job_repository.save(job);

            return await this.student_apply_job_repository.save(already__apply_job);
        } else {
            throw new Error('ไม่สามารถยกเลิกการอนุมัติ');
        }
    }
}
