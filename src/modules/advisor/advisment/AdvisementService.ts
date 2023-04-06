import { Service } from 'typedi';
import { IAdvisementService } from '../interface';
import { Advisor } from '../../../entity/Advisor';
import { AdvisorRepository } from '../AdvisorRepository';
import { StudentRegisterRepository } from '../../student/register/StudentRegisterRepository';
import { Student } from '../../../entity/Student';

@Service()
export class AdvisementService implements IAdvisementService {
    private readonly advisor_repository = new AdvisorRepository(Advisor);
    private readonly student_repository = new StudentRegisterRepository(Student);
    deleteAdvisementStudent(student_id: string, advisor_id: string): Promise<Advisor | null> {
       throw "Not implement yet"
    }

    setAdvisementStudent(student_id: string, advisor_id: string): Promise<Advisor | null> {
        throw "Not implement yet"
    }
}
