import { Announcement } from '../../entity/Announcement';
import { AnnouncementRepository } from './AnnouncementRepository';
import { Service } from 'typedi';
import { AnnouncementInput, UpdateAnnouncementInput } from './args/AnnouncementInput';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { AdvisorRepository } from '../advisor/AdvisorRepository';
import { Advisor } from '../../entity/Advisor';
import { Account } from '../../entity/Account';
import { AccountRepository } from '../account/AccountRepository';
import { RoleOption } from '../../shared/types/Roles';

@Service()
export class AnnouncementService {
    constructor(
        private readonly ann_repository = new AnnouncementRepository(Announcement),
        private readonly account_repository = new AccountRepository(Account),
        private readonly advisor_repository = new AdvisorRepository(Advisor)
    ) {}
    async getAllAnnouncement() {
        const result = await this.ann_repository.find();
        return result;
    }
    async createAnnouncement(announcement_info: AnnouncementInput, advisor_id: string) {
        // advisor_id จะปรับไปใช้ context จาก ที่ได้รับจาก cookies
        const { title, desc } = announcement_info;
        const account = await this.account_repository.findOne('id', advisor_id);

        if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (account.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถสร้างประกาศได้ ');

        const cleaned_title = title.trim();
        const cleaned_desc = desc.trim();

        if (title.length >= 255) {
            throw new Error('หัวข้อต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร');
        }

        if (title.length <= 5) {
            throw new Error('หัวข้อน้อยเกินไป');
        }

        if (desc.length >= 5000) {
            throw new Error('รายละเอียดมากเกินไป');
        }

        if (desc.length <= 5) {
            throw new Error('รายละเอียดต้องมากกว่า 5 ตัวอักษรขึ้นไป');
        }

        const saved_ann = await this.ann_repository.save(new Announcement(cleaned_title, cleaned_desc));

        account.is_advisor.announcements.push(saved_ann);

        await this.account_repository.save(account);
        return saved_ann;
    }

    async getOneBy(constraints_key: GetWithKeyInput) {
        const { value, target } = constraints_key;
        return await this.ann_repository.findOne(target, value);
    }

    async deleteAnnouncement(announcement_id: string, user_id: string | undefined) {
        if (!user_id) {
            throw new Error("You're not authorized");
        }
        const fmt_announcement_id = announcement_id.trim().toLocaleLowerCase();
        const user = await this.account_repository.findOne('id', user_id);
        if (!user) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (user.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถลบประกาศได้ ');

        const already_announcement = await this.ann_repository.findOne('id', fmt_announcement_id);
        if (!already_announcement) throw new Error('ไม่พบข้อมูลประกาศที่จะลบ');
        return await this.ann_repository.delete(already_announcement);
    }

    async updateAnnouncement(update_input: UpdateAnnouncementInput) {
        const advisor_id = 'ba329a17-445e-44b8-8885-abc646812715        '; // your advisor id
        const advisor = await this.account_repository.findOne('advisor_id', advisor_id);
        if (!advisor) throw new Error('ไม่มีสิทธิ์เข้าถึง');
        if (advisor.role !== RoleOption.COMMITTEE) throw new Error('กรรมการเท่านั้นที่สามารถลบประกาศได้ ');

        const { title, desc, id } = update_input;
        const update_announcement = await this.ann_repository.findOne('id', id);
        if (!update_announcement) throw new Error('ไม่พบประกาศที่จะแก้ไข');
        update_announcement.title = !!title ? title.trim() : update_announcement.title;
        update_announcement.description = !!desc ? desc.trim() : update_announcement.description;

        return await this.ann_repository.save(update_announcement);
    }
}
