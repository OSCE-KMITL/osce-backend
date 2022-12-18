import {BaseRepo} from "../BaseRepo";
import {Announcement} from "./Announcement";
import {Service} from "typedi";

@Service()
export class AnnouncementRepository extends BaseRepo<Announcement>{

}

