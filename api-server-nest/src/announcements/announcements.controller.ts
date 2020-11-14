import {Body, Controller, Get, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {LoggingInterceptor} from "../logging/logging.interceptor";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../authentication/auth.guard";
import {AnnouncementsService} from "./announcements.service";
import {CreateOrUpdateAnnouncementRequest} from "./dto/create-or-update-announcement-request";
import {AnnouncementResponse} from "./dto/announcement-response";

@Controller(`${VERSION_1_URI}/announcements`)
@UseInterceptors(LoggingInterceptor)
@ApiTags('announcements')
export class AnnouncementsController {

    constructor(private readonly announcementService: AnnouncementsService) {}

    @Get()
    @ApiOperation({ summary: 'return all events (currently this will always be a list of one)'})
    getAll(): Promise<AnnouncementResponse> {
        console.log('!!! HERE I AM: ')
        return this.announcementService.findAll()
            .then(announcements => {
                console.log('!!! and then: ' + JSON.stringify(announcements, null, 4))
                return new AnnouncementResponse({ announcements }}))
    }

    @Post('/ensure-one-announcement')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create an announcement if it does not exist or update the current one if present.' })
    ensureOneAnnouncement(@Body() announcement: CreateOrUpdateAnnouncementRequest): Promise<AnnouncementResponse> {
        return this.announcementService.ensureOne(announcement)
            .then(announcement => new AnnouncementResponse({ announcements: [announcement]}))
    }
}
