import {Test, TestingModule} from "@nestjs/testing";
import {SequelizeModule} from "@nestjs/sequelize";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";
import {CurrentEvent} from "../../../src/current-events/models/current-event.model";
import {VenueModel} from "../../../src/venues/models/venue.model";
import {Event} from "../../../src/events/models/event.model";
import {EventsService} from "../../../src/events/events.service";
import {VenuesService} from "../../../src/venues/venues.service";
import {CurrentEventsService} from "../../../src/current-events/current-events.service";
import {AnnouncementModel} from "../../../src/announcements/models/announcement.model";
import {AnnouncementsService} from "../../../src/announcements/announcements.service";
import BitlyService from "../../../dist/events/bitly.service";
import {WinstonModule} from "nest-winston";
import {format, transports} from "winston";

const NUXT_INTERNAL_POSTFIX = 'Repository'

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
                models: [CurrentEvent, VenueModel, Event, AnnouncementModel]
            }),
            SequelizeModule.forFeature([Event, VenueModel, CurrentEvent, AnnouncementModel]),
            WinstonModule.forRoot({
                transports: [
                    // TODO: should we factor this out into a secondary file?
                    new transports.Console({
                        format: format.combine(
                            format.label({ label: `TEST:api-server:${process.pid}` }),
                            format.timestamp(),
                            format.colorize(),
                            format.printf(({ level, message, label, timestamp }) => {
                                return `${level}: ${timestamp} [${label}] -- ${message}`;
                            })
                        )
                    })
                ]
            })
        ],
        providers: [
            EventsService,
            VenuesService,
            CurrentEventsService,
            AnnouncementsService,
            BitlyService
        ]
    }).compile();

    const eventModel = testingModule.get(`Event${NUXT_INTERNAL_POSTFIX}`) as typeof Event;
    const venueModel = testingModule.get(`VenueModel${NUXT_INTERNAL_POSTFIX}`) as typeof VenueModel;
    const announcementModel = testingModule.get(`AnnouncementModel${NUXT_INTERNAL_POSTFIX}`) as typeof AnnouncementModel;

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
    venueModel: typeof VenueModel,
    announcementModel: typeof AnnouncementModel,
    testingModule: TestingModule
}
