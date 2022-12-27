import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Announcement } from '../../entity/Announcement';
import { AnnouncementService } from './AnnouncementService';
import { AnnouncementInput, UpdateAnnouncementInput } from './args/AnnouncementInput';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';

@Resolver()
//Service dependency inject
@Service()
export class AnnouncementController {
    private readonly announcement_service: AnnouncementService;
    constructor() {}
    @Query(() => [Announcement], { nullable: 'items' })
    async getAnnouncements(): Promise<Announcement[] | null> {
        return this.announcement_service.getAllAnnouncement();
    }
    @Query(() => Announcement, { nullable: true })
    async getAnnouncement(@Arg('with_key') constraints_key: GetWithKeyInput): Promise<Announcement | null> {
        return this.announcement_service.getOneBy(constraints_key);
    }

    @Mutation(() => Announcement, { nullable: true })
    async createAnnouncement(@Arg('announcement_info') announcement_info: AnnouncementInput): Promise<Announcement | null> {
        return this.announcement_service.createAnnouncement(announcement_info);
    }

    @Mutation(() => Announcement, { nullable: true })
    async deleteAnnouncement(@Arg('delete_by_key') delete_by_key: GetWithKeyInput): Promise<Announcement | null> {
        return this.announcement_service.deleteAnnouncement(delete_by_key);
    }
    @Mutation(() => Announcement, { nullable: true })
    async updateAnnouncement(@Arg('update_input') update_input: UpdateAnnouncementInput): Promise<Announcement | null> {
        return this.announcement_service.updateAnnouncement(update_input);
    }
}
