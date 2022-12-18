import { Announcement } from "./Announcement";
import { AnnouncementRepository } from "./AnnouncementRepository";
import { Service } from "typedi";
import {
  AnnouncementInput,
  UpdateAnnouncementInput,
} from "../args/AnnouncementInput";
import { GetWithKeyInput } from "../args/GetWithKeyInput";

@Service()
export class AnnouncementService {
  private readonly repository: AnnouncementRepository;
  constructor() {
    this.repository = new AnnouncementRepository(Announcement);
  }
  async getAllAnnouncement() {
    return await this.repository.find();
  }
  async createAnnouncement(announcement_info: AnnouncementInput) {
    const { title, desc } = announcement_info;
    if (title.length > 255)
      throw new Error("หัวข้อต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร");
    if (desc.length > 1000)
      throw new Error("ข้อความต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร");
    const cleaned_title = title.trim();
    const cleaned_desc = desc.trim();
    const ann = new Announcement(cleaned_title, cleaned_desc);
    return await this.repository.save(ann);
  }

  async getOneBy(constraints_key: GetWithKeyInput) {
    const { value, target } = constraints_key;
    return await this.repository.findOne(target, value);
  }

  async deleteAnnouncement(constraints_key: GetWithKeyInput) {
    const { target, value } = constraints_key;
    const already_announcement = await this.repository.findOne(target, value);
    if (!already_announcement) throw new Error("ไม่พบข้อมูลประกาศที่จะลบ");
    return await this.repository.delete(already_announcement);
  }

  async updateAnnouncement(update_input: UpdateAnnouncementInput) {
    const { title, desc, id } = update_input;
    const update_announcement = await this.repository.findOne("id", id);
    if (!update_announcement) throw new Error("ไม่พบประกาศที่จะแก้ไข");
    update_announcement.title = !!title ? title : update_announcement.title;
    update_announcement.description = !!desc
      ? desc
      : update_announcement.description;

    return await this.repository.save(update_announcement);
  }
}
