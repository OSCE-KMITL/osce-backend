import { MySqlDataSource } from "../../ormconfig";
import { Service } from "typedi";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { Advisor } from "./advisor/Advisor";
import { BaseRepository } from "./BaseRepository";
import { Repository } from "typeorm/repository/Repository";

export class BaseRepo<T> {
  private repository: Repository<any>;

  constructor(target: EntityTarget<any>) {
    this.repository = MySqlDataSource.getRepository(target);
  }

  async save(entity: T): Promise<T> {
    const createdAccount = await this.repository.save(entity);
    return createdAccount;
  }

  async delete(entity: T): Promise<T> {
    //  _id will be undefined when you're calling. this mutation , Please on client side.
    const hasDeleted = await this.repository.remove(entity);
    return hasDeleted;
  }

  async find(): Promise<T[]>;
  async find(target: string, value: string): Promise<T[]>;
  async find(target?: string, value?: string): Promise<T[]> {
    if (target && value) {
      return await this.repository.findBy({ [value]: target });
    }
    return await this.repository.find();
  }

  async findOne(target: string, value: string): Promise<T | null> {
    const advisor = await this.repository.findOneBy({ [target]: value });
    return advisor;
  }

  async update(entity: T): Promise<T> {
    throw new Error("this method not implemented");
  }
}
