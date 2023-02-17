import { MySqlDataSource } from '../../ormconfig';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { Repository } from 'typeorm/repository/Repository';

interface KeyObject {
    value:string;
    key:string
}

export class BaseRepository<T> {
    private repository: Repository<any>;

    constructor(entity_target: EntityTarget<any>) {
        this.repository = MySqlDataSource.getRepository(entity_target);
    }

    async save(entity: T): Promise<T> {
        try {
            return await this.repository.save(entity);
        }catch (e) {
            console.log(e);
            throw e
        }
    }

    async delete(entity: T): Promise<T> {
        //  id จะไม่ return เพราะถูกลบไปแล้ว ระวังตอนที่เรียกผ่าน front-end , apollo playground
        try {
            return await this.repository.remove(entity);
        }catch (e) {
            console.log(e);
            throw e
        }

    }

    async find(): Promise<T[]>;
    async find(target: string, value: string): Promise<T[]>;
    async find(target?: string, value?: string): Promise<T[]> {
        try {
            if (target && value) {
                return await this.repository.findBy({ [target]: value });
            }
            return await this.repository.find();
        }catch (e) {
            console.log(e);
            throw e
        }

    }

    async findOne(target: string, value: string): Promise<T | null> {
        try {
            const user = await this.repository.findOneBy({ [target]: value });
            return user;
        }catch (e) {
            console.log(e);
            throw e
        }

    }



    async update(entity: T): Promise<T> {
        throw new Error('this method not implemented');
    }
}
