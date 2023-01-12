import { MySqlDataSource } from '../../ormconfig';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { Repository } from 'typeorm/repository/Repository';

export class BaseRepository<T> {
    private repository: Repository<any>;

    constructor(entity_target: EntityTarget<any>) {
        this.repository = MySqlDataSource.getRepository(entity_target);
    }

    async save(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    async delete(entity: T): Promise<T> {
        //  id จะไม่ return เพราะถูกลบไปแล้ว ระวังตอนที่เรียกผ่าน front-end , apollo playground
        return await this.repository.remove(entity);
    }

    async find(): Promise<T[]>;
    async find(target: string, value: string): Promise<T[]>;
    async find(target?: string, value?: string): Promise<T[]> {
        if (target && value) {
            return await this.repository.findBy({ [target]: value });
        }
        return await this.repository.find();
    }

    async findOne(target: string, value: string): Promise<T | null> {
        if (!target || !value) {
            return null;
        }

        return await this.repository.findOneBy({ [target]: value });
    }

    async update(entity: T): Promise<T> {
        throw new Error('this method not implemented');
    }
}
