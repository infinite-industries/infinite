import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./models/event.model";
import {EventsController} from "./events.controller";
import {EventsService} from "./events.service";
import BitlyService from "./bitly.service";
import EventsAuthenticatedController from "./events.authenticated.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Event]),
        NotificationsModule
    ],
    controllers: [EventsAuthenticatedController, EventsController],
    providers: [
        EventsService,
        BitlyService
    ]
})
export class EventsModule {}
