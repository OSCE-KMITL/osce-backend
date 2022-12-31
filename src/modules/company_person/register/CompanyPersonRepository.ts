import { CompanyPerson } from '../../../entity/CompanyPerson';
import { Service } from 'typedi';
import { BaseRepository } from '../../BaseRepository';

@Service()
export class CompanyPersonRepository extends BaseRepository<CompanyPerson> {}
