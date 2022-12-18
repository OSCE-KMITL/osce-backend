import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Announcement } from "./Announcement";
import { AnnouncementService } from "./AnnouncementService";
import {AnnouncementInput, UpdateAnnouncementInput} from "../args/AnnouncementInput";
import { GetWithKeyInput } from "../args/GetWithKeyInput";

@Resolver()
@Service()
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}
  @Query(() => [Announcement], { nullable: "items" })
  async getAnnouncements(): Promise<Announcement[] | null> {
    return this.announcementService.getAllAnnouncement();
  }
  @Query(() => Announcement, { nullable: true })
  async getAnnouncement(
    @Arg("with_key") constraints_key: GetWithKeyInput
  ): Promise<Announcement | null> {
    return this.announcementService.getOneBy(constraints_key);
  }

  @Mutation(() => Announcement, { nullable: true })
  async createAnnouncement(
    @Arg("announcement_info") announcement_info: AnnouncementInput
  ): Promise<Announcement | null> {
    return this.announcementService.createAnnouncement(announcement_info);
  }

  @Mutation(() => Announcement, { nullable: true })
  async deleteAnnouncement(
    @Arg("delete_by_key") delete_by_key: GetWithKeyInput
  ): Promise<Announcement | null> {
    return this.announcementService.deleteAnnouncement(delete_by_key);
  }
  @Mutation(() => Announcement, { nullable: true })
  async updateAnnouncement(
    @Arg("update_input") update_input: UpdateAnnouncementInput,
  ): Promise<Announcement | null> {
    return this.announcementService.updateAnnouncement(update_input);
  }
}
