import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {CurrentEvent} from "./dto/current-event.model";
import {CurrentEventsController} from "./current-events.controller";
import {CurrentEventsService} from "./current-events.service";

@Module({
    imports: [
        SequelizeModule.forFeature([CurrentEvent])
    ],
    controllers: [CurrentEventsController],
    providers: [CurrentEventsService]
})
export class CurrentEventsModule {
}
