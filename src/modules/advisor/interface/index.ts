import { Advisor } from '../../../entity/Advisor';

export interface IAdvisementService {
    setAdvisementStudent(student_id :string, advisor_id:string):Promise<Advisor | null>
    deleteAdvisementStudent(student_id :string, advisor_id:string):Promise<Advisor | null>

}