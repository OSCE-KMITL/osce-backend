import { AdvisorAccount } from "../../entities/AdvisorAccount";
import { UpdateAdvisorInput } from "../../controller/advisor/input/AdvisorAccountInput";
import { AdvisorRepository } from "../../repositories/AdvisorRepository";

export class AdvisorAccountService {
  private readonly repository = new AdvisorRepository();
  context: AdvisorAccount[] = [];
  constructor() {}

  async searchAllAdvisor(): Promise<AdvisorAccount[]> {
    const accounts = await this.repository.find();
    return accounts;
  }

  async createAdvisorAccount(account: AdvisorAccount): Promise<AdvisorAccount> {
    const createdAccount = await this.repository.create(account);
    return createdAccount;
  }

  async getAdvisorById(advisorId: string): Promise<AdvisorAccount> {
    const alreadyAccount = await this.repository.findOne("_id", advisorId);
    if (!alreadyAccount) throw new Error(`ไม่พบผู้ใช้นี้ในระบบ`);
    return alreadyAccount;
  }

  updateAdvisorAccount(advisorInput: UpdateAdvisorInput) {
    const { fullName, faculty, id } = advisorInput;
    const hasAlreadyAccountIndex = this.context.findIndex((account) => {
      return account.id === id;
    });

    if (hasAlreadyAccountIndex <= -1)
      throw new Error("ไม่พบผู้ใช้ที่ต้องการจะแก้ไข");

    const alreadyAdvisor = this.context[hasAlreadyAccountIndex];
    alreadyAdvisor.fullName = !!fullName ? fullName : alreadyAdvisor.fullName;
    alreadyAdvisor.faculty = !!faculty ? faculty : alreadyAdvisor.faculty;
    return alreadyAdvisor;
  }

  async deletedAdvisorAccount(advisorId: string): Promise<AdvisorAccount> {
    const hasAlreadyUser = await this.repository.findOne("_id", advisorId);
    if (!hasAlreadyUser) throw new Error("ไม่พบผู้ใช้ที่ต้องการจะลบ");
    //  _id will be undefined when you're calling. this mutation , Please don't return _id on client
    const deleted = await this.repository.delete(hasAlreadyUser);
    return deleted;
  }
}
