import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./models/event.model";
import {EventsController} from "./events.controller";
import {EventsService} from "./events.service";
import BitlyService from "./bitly.service";
import SlackNotificationService from "./slack-notification.service";

@Module({
    imports: [
        SequelizeModule.forFeature([Event])
    ],
    controllers: [EventsController],
    providers: [
        EventsService,
        BitlyService,
        SlackNotificationService
    ]
})
export class EventsModule {
}
