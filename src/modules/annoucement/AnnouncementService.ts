import { Announcement } from '../../entity/Announcement';
import { AnnouncementRepository } from './AnnouncementRepository';
import { Service } from 'typedi';
import { AnnouncementInput, UpdateAnnouncementInput } from './args/AnnouncementInput';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { AdvisorRepository } from '../advisor/account/AdvisorRepository';
import { Advisor } from '../../entity/Advisor';

@Service()
export class AnnouncementService {
    private readonly ann_repository: AnnouncementRepository;
    private readonly advisor_repository: AdvisorRepository;
    constructor() {
        this.ann_repository = new AnnouncementRepository(Announcement);
        this.advisor_repository = new AdvisorRepository(Advisor);
    }
    async getAllAnnouncement() {
        return await this.ann_repository.find();
    }
    async createAnnouncement(announcement_info: AnnouncementInput) {
        const advisor_id = '44c81634-970d-4164-8d20-67547ea7dd85';
        const advisor = await this.advisor_repository.findOne('advisor_id', advisor_id);
        if (!advisor) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (!advisor.is_committee) throw new Error('กรรมการเท่านั้นที่สามารถสร้างประกาศได้ ');

        const { title, desc } = announcement_info;
        if (title.length > 255) throw new Error('หัวข้อต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
        if (desc.length > 1000) throw new Error('ข้อความต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร');
        const cleaned_title = title.trim();
        const cleaned_desc = desc.trim();
        const saved_ann = await this.ann_repository.save(new Announcement(cleaned_title, cleaned_desc));
        advisor.announcements.push(saved_ann);
        await this.advisor_repository.save(advisor);
        return saved_ann;
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.ann_repository.findOne(target, value);
    }

    async deleteAnnouncement(constraints_key: GetWithKeyInput) {
        const advisor_id = '94745ecc-4218-4e9d-b330-ee8128bd9d45';
        const owner = await this.advisor_repository.findOne('advisor_id', advisor_id);
        if (!owner) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (!owner.is_committee) throw new Error('กรรมการเท่านั้นที่สามารถลบประกาศได้ ');

        const { target, value } = constraints_key;
        const already_announcement = await this.ann_repository.findOne(target, value);
        if (!already_announcement) throw new Error('ไม่พบข้อมูลประกาศที่จะลบ');
        return await this.ann_repository.delete(already_announcement);
    }

    async updateAnnouncement(update_input: UpdateAnnouncementInput) {
        const advisor_id = '94745ecc-4218-4e9d-b330-ee8128bd9d45'; // your advisor id
        const advisor = await this.advisor_repository.findOne('advisor_id', advisor_id);
        if (!advisor) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (!advisor.is_committee) throw new Error('กรรมการเท่านั้นที่สามารถแก้ประกาศได้ ');

        const { title, desc, id } = update_input;
        const update_announcement = await this.ann_repository.findOne('id', id);
        if (!update_announcement) throw new Error('ไม่พบประกาศที่จะแก้ไข');
        update_announcement.title = !!title ? title : update_announcement.title;
        update_announcement.description = !!desc ? desc : update_announcement.description;

        return await this.ann_repository.save(update_announcement);
    }
}
