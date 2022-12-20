import { BaseRepository } from '../BaseRepository';
import { Announcement } from '../../entity/Announcement';
import { Service } from 'typedi';

@Service()
export class AnnouncementRepository extends BaseRepository<Announcement> {}
