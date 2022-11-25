import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {AdvisorAccountService} from "../../services/account/AdvisorAccountService";
import {Advisor} from "../../entities/Advisor";
import {AdvisorAccountInput, UpdateAdvisorInput,} from "./input/AdvisorAccountInput";
import {Service} from "typedi";

@Service()
@Resolver()
export class AdvisorAccountController {
    constructor(private readonly advisorService: AdvisorAccountService) {
    }

    @Query(() => [Advisor], {nullable: "items"})
    async getAllAdvisorAccounts(): Promise<Advisor[] | null> {
        return this.advisorService.searchAllAdvisor();
    }

    @Query(() => [Advisor], {nullable: "items"})
    async getAllAdvisorAccountsBy(
        @Arg("target" ,{nullable:true})
        @Arg("value" ,{nullable:true})
            target: string,
        value: string
    ): Promise<Advisor[]> {
        return this.advisorService.searchAllAdvisorBy(target, value);
    }

    @Query(() => Advisor, {nullable: true})
    async getAdvisorAccount(
        @Arg("advisorId") advisorId: string
    ): Promise<Advisor> {
        if (!advisorId) throw new Error("please provide advisor id");
        return this.advisorService.getAdvisorById(advisorId);
    }

    @Mutation(() => Advisor, {nullable: false})
    async createAdvisorAccount(
        @Arg("advisorInfo") advisorInput: AdvisorAccountInput
    ): Promise<Advisor> {
        const {fullName, password, faculty, email} = advisorInput;
        const account = new Advisor(email, password, fullName, faculty);
        return this.advisorService.createAdvisorAccount(account);
    }

    @Mutation(() => Advisor, {nullable: false})
    updateAdvisorAccount(
        @Arg("updateInfo") updateInfo: UpdateAdvisorInput
    ): Promise<Advisor> {
        return this.advisorService.updateAdvisorAccount(updateInfo);
    }

    @Mutation(() => Advisor, {nullable: true})
    //  _id will be undefined when you're calling. this mutation , Please don't return _id on client side.
    async deleteAdvisorAccount(@Arg("id") id: string): Promise<Advisor> {
        return await this.advisorService.deletedAdvisorAccount(id);
    }
}
