import { Advisor } from '../../../entity/Advisor';
import { Service } from 'typedi';
import { BaseRepository } from '../../BaseRepository';

@Service()
export class AdvisorRepository extends BaseRepository<Advisor> {}
