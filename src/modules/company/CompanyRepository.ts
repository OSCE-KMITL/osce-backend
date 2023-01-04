import { BaseRepository } from '../BaseRepository';
import { Company } from '../../entity/Company'; 
import { Service } from 'typedi';

@Service()
export class CompanyRepository extends BaseRepository<Company> {}
