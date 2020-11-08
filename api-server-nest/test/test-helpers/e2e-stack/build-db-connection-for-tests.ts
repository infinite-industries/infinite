import {Test, TestingModule} from "@nestjs/testing";
import {SequelizeModule} from "@nestjs/sequelize";
import {DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./start-database";
import {CurrentEvent} from "../../../src/current-events/dto/current-event.model";
import {Venue} from "../../../dist/venues/dto/venue.model";
import {Event} from "../../../src/events/models/event.model";
import {EventsService} from "../../../src/events/events.service";
import {VenuesService} from "../../../src/venues/venues.service";
import {CurrentEventsService} from "../../../src/current-events/current-events.service";

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
                models: [CurrentEvent, Venue, Event]
            }),
            SequelizeModule.forFeature([Event, Venue, CurrentEvent])
        ],
        providers: [
            EventsService,
            VenuesService,
            CurrentEventsService
        ]
    }).compile();

    const eventModel = testingModule.get('EventRepository') as typeof Event;
    const venueModel = testingModule.get('VenueRepository') as typeof Venue;

    return {
        eventModel,
        venueModel,
        testingModule
    };
}

export default buildDbConnectionsForTests;

export type DatabaseModels = {
    eventModel: typeof Event,
    venueModel: typeof Venue,
    testingModule: TestingModule
}
