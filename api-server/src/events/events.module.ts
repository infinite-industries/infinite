import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./models/event.model";
import {EventsController} from "./events.controller";
import {EventsService} from "./events.service";
import BitlyService from "./bitly.service";
import EventsAuthenticatedController from "./events.authenticated.controller";
import { NotificationsModule } from "../notifications/notifications.module";
import { DatetimeVenueModel } from './models/datetime-venue.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Event, DatetimeVenueModel]),
        NotificationsModule
    ],
    controllers: [EventsAuthenticatedController, EventsController],
    providers: [
        EventsService,
        BitlyService
    ]
})
export class EventsModule {}
