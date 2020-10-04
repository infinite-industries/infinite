import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {Event} from "./dto/event.model";
import {EventsController} from "./events.controller";
import {EventsService} from "./events.service";

@Module({
    imports: [
        SequelizeModule.forFeature([Event])
    ],
    controllers: [EventsController],
    providers: [EventsService]
})
export class EventsModule {
}
