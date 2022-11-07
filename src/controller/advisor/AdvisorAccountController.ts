import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { AdvisorAccountService } from "../../services/account/AdvisorAccountService";
import { AdvisorAccount } from "../../entities/AdvisorAccount";
import {
  AdvisorAccountInput,
  UpdateAdvisorInput,
} from "./input/AdvisorAccountInput";
@Resolver()
export class AdvisorAccountController {
  constructor(private readonly advisorService = new AdvisorAccountService()) {}

  @Query(() => [AdvisorAccount], { nullable: "items" })
  async getAllAdvisorAccounts(): Promise<AdvisorAccount[] | null> {
    return this.advisorService.searchAllAdvisor();
  }

  @Query(() => [AdvisorAccount], { nullable: "items" })
  async getAllAdvisorAccountsBy(
    @Arg("target")
    @Arg("value")
    target: string,
    value: string
  ): Promise<AdvisorAccount[]> {
    return this.advisorService.searchAllAdvisorBy(target, value);
  }

  @Query(() => AdvisorAccount, { nullable: true })
  async getAdvisorAccount(
    @Arg("advisorId") advisorId: string
  ): Promise<AdvisorAccount> {
    if (!advisorId) throw new Error("please provide advisor id");
    return this.advisorService.getAdvisorById(advisorId);
  }

  @Mutation(() => AdvisorAccount, { nullable: false })
  async createAdvisorAccount(
    @Arg("advisorInfo") advisorInput: AdvisorAccountInput
  ): Promise<AdvisorAccount> {
    const { fullName, password, faculty, email } = advisorInput;
    const account = new AdvisorAccount(email, password, fullName, faculty);
    return this.advisorService.createAdvisorAccount(account);
  }

  @Mutation(() => AdvisorAccount, { nullable: false })
  updateAdvisorAccount(
    @Arg("updateInfo") updateInfo: UpdateAdvisorInput
  ): Promise<AdvisorAccount> {
    return this.advisorService.updateAdvisorAccount(updateInfo);
  }

  @Mutation(() => AdvisorAccount, { nullable: true })
  //  _id will be undefined when you're calling. this mutation , Please don't return _id on client side.
  async deleteAdvisorAccount(@Arg("id") id: string): Promise<AdvisorAccount> {
    return await this.advisorService.deletedAdvisorAccount(id);
  }
}
