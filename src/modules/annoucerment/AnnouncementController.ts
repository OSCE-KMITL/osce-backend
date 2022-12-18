import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {Announcement ,} from "./Announcement";
import {AnnouncementService} from "./AnnouncementService";
@Service()
@Resolver()
export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {
    }

    @Query(() => [Announcement], {nullable: "items"})
    async getAnnouncerments(): Promise<Announcement[] | null> {
        return null as any
    }


    @Mutation(() => Announcement,{nullable:true})
    async createAnouncerment():Promise<Announcement | null> {
        return null as any
    }


}
