import {Test, TestingModule} from "@nestjs/testing";
import {SequelizeModule} from "@nestjs/sequelize";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";
import {CurrentEvent} from "../../../src/current-events/models/current-event.model";
import {Venue} from "../../../src/venues/models/venue.model";
import {Event} from "../../../src/events/models/event.model";
import {EventsService} from "../../../src/events/events.service";
import {VenuesService} from "../../../src/venues/venues.service";
import {CurrentEventsService} from "../../../src/current-events/current-events.service";
import {AnnouncementModel} from "../../../src/announcements/models/announcement.model";
import {AnnouncementsService} from "../../../src/announcements/announcements.service";

async function buildDbConnectionsForTests(dbPort: number): Promise<DatabaseModels> {
    const testingModule: TestingModule = await Test.createTestingModule({
        imports: [
            SequelizeModule.forRoot({
                dialect: 'postgres',
                autoLoadModels: true,
                synchronize: true,
                host: DB_HOST,
                port: dbPort,
                username: DB_USERNAME,
                password: DB_PASSWORD,
                database: DB_NAME,
                models: [CurrentEvent, Venue, Event, AnnouncementModel]
            }),
            SequelizeModule.forFeature([Event, Venue, CurrentEvent, AnnouncementModel])
        ],
        providers: [
            EventsService,
            VenuesService,
            CurrentEventsService,
            AnnouncementsService
        ]
    }).compile();

    const eventModel = testingModule.get('EventRepository') as typeof Event;
    const venueModel = testingModule.get('VenueRepository') as typeof Venue;
    const announcementModel = testingModule.get('AnnouncementModelRepository') as typeof AnnouncementModel

    return {
        eventModel,
        venueModel,
        announcementModel,
        testingModule
    };
}

export default buildDbConnectionsForTests;

export type DatabaseModels = {
    eventModel: typeof Event,
    venueModel: typeof Venue,
    announcementModel: typeof AnnouncementModel,
    testingModule: TestingModule
}
