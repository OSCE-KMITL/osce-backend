import { BaseRepository } from "./BaseRepository";
import { AdvisorAccount } from "../entities/AdvisorAccount";
import { MySqlDataSouce } from "../../ormconfig";
import {Service} from "typedi";

@Service()
export class AdvisorRepository implements BaseRepository<AdvisorAccount> {
  constructor(
    private readonly repository = MySqlDataSouce.getRepository(AdvisorAccount)
  ) {}
  async save(entity: AdvisorAccount): Promise<AdvisorAccount> {
    const createdAccount = await this.repository.save(entity);
    return createdAccount;
  }

  async delete(advisor: AdvisorAccount): Promise<AdvisorAccount> {
    //  _id will be undefined when you're calling. this mutation , Please on client side.
    const hasDeleted = await this.repository.remove(advisor);
    return hasDeleted;
  }

  async find(): Promise<AdvisorAccount[]>;
  async find(target: string, value: string): Promise<AdvisorAccount[]>;
  async find(target?: string, value?: string): Promise<AdvisorAccount[]> {
    if (target && value) {
      return await this.repository.findBy({[value]:target});
    }
    return await this.repository.find();
  }

  async findOne(target: string, value: string): Promise<AdvisorAccount | null> {
    const advisor = await this.repository.findOneBy({ [target]: value });
    return advisor;
  }

  async update(entity: AdvisorAccount): Promise<AdvisorAccount> {
    throw new Error("this method not implemented");
  }
}
