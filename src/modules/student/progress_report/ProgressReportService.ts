import { StudentRegisterRepository } from '../register/StudentRegisterRepository';
import { Student } from '../../../entity/Student';
import { ProgressReportRepository } from './ProgressReportRepository';
import { ProgressReport } from '../../../entity/ProgressReport';
import { Service } from 'typedi';
import { ProgressReportInput } from './args';
import { ProgressReportBuilder } from './ProgressReportBuilder/ProgressReportBuilder';

@Service()
export class ProgressReportService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly progress_report_repository = new ProgressReportRepository(ProgressReport);

    async createProgressReport(payload: ProgressReportInput, student_id: string): Promise<ProgressReport> {
        const { current_res, commute_score, work_score, advisement_score, mentor_position, mentor_name,  other_suggest , mentor_tel ,mentor_email} = payload;
        if (!student_id) throw new Error('คุณไม่มีสิทธิเข้าถึง ');

        try {
            const student = await this.student_repository.findOne('student_id', student_id);
            if (!student) throw new Error('คุณไม่มีสิทธิเข้าถึง ');

            const report_no = (student.progress_report.length += 1);

            const report = new ProgressReportBuilder()
                .setReportNo(report_no)
                .setWorkScore(work_score)
                .setCommuteScore(commute_score)
                .setAdvisementScore(advisement_score)
                .setCurrentRes(current_res)
                .setOtherSuggest(other_suggest)
                .setMentorTel(mentor_tel)
                .setMentorName(mentor_name)
                .setMentorPosition(mentor_position)
                .setMentorEmail(mentor_email)
                .build()


            const saved_report = await this.progress_report_repository.save(report);

            student.progress_report.push(report);
            await this.student_repository.save(student);

            return saved_report;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getProgressReports(): Promise<ProgressReport[]> {
        try {
            return await this.progress_report_repository.find();
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    async getProgressReport(id: string): Promise<ProgressReport | null> {
        try {
            const report = this.progress_report_repository.findOne('progress_report_id', id);
            if (!report) {
                throw new Error('ไม่พบรายงานที่คุณค้นหา');
            }
            return report;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    async deleteProgressReport(report_id: string, student_id: string) {
        try {
            const report = await this.progress_report_repository.findOne('progress_report_id', report_id);
            if (!report) throw new Error('ไม่พบรายงานที่ต้องการจะลบ');
            return await this.progress_report_repository.delete(report);
        } catch (e) {
            throw e;
        }
    }
}
