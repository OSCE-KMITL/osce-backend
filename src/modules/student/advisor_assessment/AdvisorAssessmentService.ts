import { Job } from './../../../entity/Job';
import { JobRepository } from './../../job/JobRepository';
import { RoleOption } from './../../../shared/types/Roles';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterRepository } from '../../student/register/StudentRegisterRepository';
import { AdvisorAssessment } from '../../../entity/AdvisorAssessment';
import { AdvisorAssessmentRepository } from './AdvisorAssessmentRepository';
import { CreateAdvisorAssessmentInput } from './args/CreatAdvisorAssessmentInput';
import { Advisor } from '../../../entity/Advisor';
import { AdvisorRepository } from '../../advisor/AdvisorRepository';

@Service()
export class AdvisorAssessmentService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly job_repository = new JobRepository(Job);
    private readonly advisor_assessment_repository = new AdvisorAssessmentRepository(AdvisorAssessment);
    private readonly advisor_repository = new AdvisorRepository(Advisor);

    constructor() {}

    async getAllAdvisorAssessment() {
        const result = await this.advisor_assessment_repository.find();
        return result;
    }

    async createAdvisorAssessment(advisor_assessment_info: CreateAdvisorAssessmentInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { assessment_obj, advisor_id, score, student_id } = advisor_assessment_info;

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.ADVISOR && account.role !== RoleOption.COMMITTEE) throw new Error('อาจารย์นิเทศเท่านั้นที่สามารถดำเนินการได้');

        const advisor = await this.advisor_repository.findOne('advisor_id', advisor_id);
        if (!advisor) throw new Error('ไม่พบอาจารย์นิเทศ');

        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        if (score > 20 || score < 0) throw new Error('คะแนนการประเมินต้องอยู่ระหว่าง 0-20');

        if (student.advisor_assessment) {
            throw new Error('ไม่สามารถประเมินนักศึกษาได้ เนื่องจากประเมินนักศึกษาแล้ว');
        }

        const advisor_assessment = new AdvisorAssessment(student_id, advisor_id, assessment_obj, score);
        const saved_advisor_assessment = await this.advisor_assessment_repository.save(advisor_assessment);

        try {
            advisor.advisor_assessment.push(saved_advisor_assessment);
            await this.advisor_repository.save(advisor);
        } catch (error) {
            console.log(error);
        }

        try {
            student.advisor_assessment = saved_advisor_assessment;
            student.score_from_advisor = score;
        } catch (error) {
            console.log(error);
        }

        return await this.student_repository.save(student);
    }
}
