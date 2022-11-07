import { AdvisorAccount } from "../../entities/AdvisorAccount";
import { UpdateAdvisorInput } from "../../controller/advisor/input/AdvisorAccountInput";
import { AdvisorRepository } from "../../repositories/AdvisorRepository";
import { Service } from "typedi";
import { BaseRepository } from "../../repositories/BaseRepository";

@Service()
export class AdvisorAccountService {
  constructor(private readonly repository: AdvisorRepository) {}

  async searchAllAdvisor(): Promise<AdvisorAccount[]> {
    const allAccounts = await this.repository.find();
    return allAccounts;
  }

  async createAdvisorAccount(account: AdvisorAccount): Promise<AdvisorAccount> {
    const createdAccount = await this.repository.save(account);
    return createdAccount;
  }

  async getAdvisorById(advisorId: string): Promise<AdvisorAccount> {
    const alreadyAccount = await this.repository.findOne("id", advisorId);
    if (!alreadyAccount) throw new Error(`ไม่พบผู้ใช้นี้ในระบบ`);
    return alreadyAccount;
  }

  async updateAdvisorAccount(advisorInput: UpdateAdvisorInput) {
    const { fullName, faculty, id, status, isAdvisor, isComittee } =
      advisorInput;
    const hasAlreadyAccount = await this.repository.findOne("id", id);
    if (!hasAlreadyAccount) throw new Error("ไม่พบผู้ใช้ที่ต้องการจะแก้ไข");
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
    const updated = await this.repository.save(hasAlreadyAccount);
    return updated;
  }

  async deletedAdvisorAccount(advisorId: string): Promise<AdvisorAccount> {
    const hasAlreadyUser = await this.repository.findOne("_id", advisorId);
    if (!hasAlreadyUser) throw new Error("ไม่พบผู้ใช้ที่ต้องการจะลบ");
    //  _id will be undefined when you're calling. this mutation , Please don't return _id on client
    const deleted = await this.repository.delete(hasAlreadyUser);
    return deleted;
  }

  async searchAllAdvisorBy(target: string, value: string) {
    const advisors = await this.repository.find(target, value);
    if (!advisors) throw new Error("พบข้อผิดพลาด");
    return advisors;
  }
}
