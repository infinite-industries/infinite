import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {AnnouncementModel} from "./models/announcement.model";
import {AnnouncementsController} from "./announcements.controller";
import {AnnouncementsService} from "./announcements.service";

@Module({
    imports: [
        SequelizeModule.forFeature([AnnouncementModel])
    ],
    controllers: [AnnouncementsController],
    providers: [AnnouncementsService]
})
export class AnnouncementsModule {
}