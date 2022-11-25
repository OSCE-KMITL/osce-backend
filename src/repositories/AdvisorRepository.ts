import { BaseRepository } from "./BaseRepository";
import { Advisor } from "../entities/Advisor";
import { MySqlDataSource } from "../../ormconfig";
import { Service } from "typedi";
import { DataSource } from "typeorm";

@Service()
export class AdvisorRepository implements BaseRepository<Advisor> {
  private readonly repository = MySqlDataSource.getRepository(Advisor);

  async save(entity: Advisor): Promise<Advisor> {
    const createdAccount = await this.repository.save(entity);
    return createdAccount;
  }

  async delete(advisor: Advisor): Promise<Advisor> {
    //  _id will be undefined when you're calling. this mutation , Please on client side.
    const hasDeleted = await this.repository.remove(advisor);
    return hasDeleted;
  }

  async find(): Promise<Advisor[]>;
  async find(target: string, value: string): Promise<Advisor[]>;
  async find(target?: string, value?: string): Promise<Advisor[]> {
    if (target && value) {
      return await this.repository.findBy({ [value]: target });
    }
    return await this.repository.find();
  }

  async findOne(target: string, value: string): Promise<Advisor | null> {
    const advisor = await this.repository.findOneBy({ [target]: value });
    return advisor;
  }

  async update(entity: Advisor): Promise<Advisor> {
    throw new Error("this method not implemented");
  }
}
