import { Advisor } from '../../entity/Advisor';
import { Service } from 'typedi';
import { BaseRepository } from '../BaseRepository';

export class AdvisorRepository extends BaseRepository<Advisor> {}
