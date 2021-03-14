import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import sequelize, {FindOptions, UpdateOptions} from "sequelize";
import {AnnouncementModel} from "./models/announcement.model";
import {CreateOrUpdateAnnouncementRequest} from "./dto/create-or-update-announcement-request";
import {v4 as uuidv4} from 'uuid';
import DbUpdateResponse, {toDbUpdateResponse} from "../shared-types/db-update-response";

Injectable()
export class AnnouncementsService {
    constructor(@InjectModel(AnnouncementModel) private announcementModel: typeof AnnouncementModel) {
    }

    findById(id: string): Promise<AnnouncementModel> {
        return this.announcementModel.findOne({ where: { id }})
    }

    findAll(findOptions?: FindOptions): Promise<AnnouncementModel []> {
        return this.announcementModel.findAll(findOptions)
    }

    ensureOne(announcement: CreateOrUpdateAnnouncementRequest): Promise<AnnouncementModel> {
        const whereAnyAnnouncementExists = sequelize.literal('true = true')

        const id = uuidv4()

        return this.announcementModel.findOrCreate(
            { where: whereAnyAnnouncementExists,
                defaults: { ...announcement, id }
            })
            .then(resp => resp[0])
    }

    create(newAnnouncement: CreateOrUpdateAnnouncementRequest): Promise<AnnouncementModel> {
        const id = uuidv4();

        return this.announcementModel.create({ ...newAnnouncement, id })
    }

    update(id: string, updatedAnnouncement: CreateOrUpdateAnnouncementRequest): Promise<AnnouncementModel> {
        const updateQueryOptions: UpdateOptions = {
            where: {id},
            returning: true
        }

        return this.announcementModel.update(updatedAnnouncement, updateQueryOptions)
            .then((toDbUpdateResponse))
            .then((dbUpdateResponse: DbUpdateResponse<AnnouncementModel>) => dbUpdateResponse[1]);
    }
}
