import { Job } from './../../../entity/Job';
import { JobRepository } from './../../job/JobRepository';
import { RoleOption } from './../../../shared/types/Roles';
import { Student } from '../../../entity/Student';
import { Service } from 'typedi';
import { Account } from '../../../entity/Account';
import { AccountRepository } from '../../account/AccountRepository';
import { StudentRegisterRepository } from '../../student/register/StudentRegisterRepository';
import { CompanyAssessment } from '../../../entity/CompanyAssessment';
import { CompanyAssessmentRepository } from './CompanyAssessmentRepository';
import { CreateCompanyAssessmentInput } from './args/CompanyAssessmentInput';
import { Company } from '../../../entity/Company';
import { CompanyRepository } from '../../company/CompanyRepository';

@Service()
export class CompanyAssessmentService {
    private readonly student_repository = new StudentRegisterRepository(Student);
    private readonly account_repository = new AccountRepository(Account);
    private readonly job_repository = new JobRepository(Job);
    private readonly company_assessment_repository = new CompanyAssessmentRepository(CompanyAssessment);
    private readonly company_repository = new CompanyRepository(Company);

    constructor() {}

    async getAllCompanyAssessment() {
        const result = await this.company_assessment_repository.find();
        return result;
    }

    async createCompanyAssessment(compay_assessment_info: CreateCompanyAssessmentInput, account_id: string) {
        const account = await this.account_repository.findOne('id', account_id);
        const { assessment_obj, company_id, improvement, score, strength, student_id } = compay_assessment_info;

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMPANY) throw new Error('บริษัทเท่านั้นที่สามารถดำเนินการได้');

        const company = await this.company_repository.findOne('id', company_id);
        if (!company) throw new Error('ไม่พบบริษัท');

        const student = await this.student_repository.findOne('student_id', student_id);
        if (!student) throw new Error('ไม่พบนักศึกษา');

        if (improvement?.length > 1600) throw new Error('ไม่สามารถกรอกข้อมูลข้อควรปรับปรุงเกิน 500 ตัวอักษร');
        if (strength?.length > 1600) throw new Error('ไม่สามารถกรอกข้อมูลจุดเด่นเกิน 500 ตัวอักษร');
        if (score > 40 || score < 0) throw new Error('คะแนนการประเมินต้องอยู่ระหว่าง 0-40');

        // console.log('company: ', company_id);
        // console.log('student: ', student_id);
        // console.log('strength: ', strength);
        // console.log('improvement: ', typeof improvement);
        // console.log('score: ', score);
        // console.log('assessment_obj: ', assessment_obj);
        // console.log('assessment_obj: ', Object.values(assessment_obj)[0]);

        if (student.company_assessment) {
            throw new Error('ไม่สามารถประเมินนักศึกษาได้ เนื่องจากประเมินนักศึกษาแล้ว');
        }

        const company_assessment = new CompanyAssessment(student_id, company_id, assessment_obj, score);
        if (improvement) {
            company_assessment.improvement = improvement;
        }
        if (strength) {
            company_assessment.strength = strength;
        }
        const saved_company_assessment = await this.company_assessment_repository.save(company_assessment);

        try {
            company.company_assessment.push(saved_company_assessment);
            await this.company_repository.save(company);
        } catch (error) {
            console.log(error);
        }

        try {
            student.company_assessment = saved_company_assessment;
            student.score_from_company = score;
        } catch (error) {
            console.log(error);
        }

        return await this.student_repository.save(student);
    }
}
