import {Advisor} from './Advisor';
import {UpdateAdvisorInput} from './input/AdvisorAccountInput';
import {AdvisorRepository} from './AdvisorRepository';
import {Service} from 'typedi';

@Service()
export class AdvisorAccountService {
  constructor(private readonly repository: AdvisorRepository) {}

  async announcementService(): Promise<Advisor[]> {
    return await this.repository.find();
  }

  async createAdvisorAccount(account: Advisor): Promise<Advisor> {
    return await this.repository.save(account);
  }

  async getAdvisorById(advisorId: string): Promise<Advisor> {
    const alreadyAccount = await this.repository.findOne('id', advisorId);
    if (!alreadyAccount) throw new Error(`ไม่พบผู้ใช้นี้ในระบบ`);
    return alreadyAccount;
  }

  async updateAdvisorAccount(advisorInput: UpdateAdvisorInput) {
    const { fullName, faculty, id, status, isAdvisor, isComittee } =
      advisorInput;
    const hasAlreadyAccount = await this.repository.findOne('id', id);
    if (!hasAlreadyAccount) throw new Error('ไม่พบผู้ใช้ที่ต้องการจะแก้ไข');
    hasAlreadyAccount.fullName = !!fullName
      ? fullName
      : hasAlreadyAccount.fullName;
    hasAlreadyAccount.faculty = !!faculty ? faculty : hasAlreadyAccount.faculty;
    hasAlreadyAccount.status = !!status ? status : hasAlreadyAccount.status;
    hasAlreadyAccount.isAdvisor = !!isAdvisor
      ? isAdvisor
      : hasAlreadyAccount.isAdvisor;
    hasAlreadyAccount.isComittee = !!isComittee
      ? isComittee
      : hasAlreadyAccount.isComittee;
    return await this.repository.save(hasAlreadyAccount);
  }

  async deletedAdvisorAccount(advisorId: string): Promise<Advisor> {
    const hasAlreadyUser = await this.repository.findOne('_id', advisorId);
    if (!hasAlreadyUser) throw new Error('ไม่พบผู้ใช้ที่ต้องการจะลบ');
    //  _id will be undefined when you're calling. this mutation , Please don't return _id on client
    return await this.repository.delete(hasAlreadyUser);
  }

  async searchAllAdvisorBy(target?: string, value?: string) {
    if (target && value) {
      return await this.repository.find(target, value);
    }
    return await this.repository.find();
  }
}
