import {Module} from "@nestjs/common";
import {VenuesController} from "./venues.controller";
import {VenuesService} from "./venues.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {VenueModel} from "./models/venue.model";
import { NotificationsModule } from "../notifications/notifications.module";
import VenuesAuthenticatedController from "./venues.authenticated.controller";

@Module({
    imports: [
        SequelizeModule.forFeature([VenueModel]),
        NotificationsModule
    ],
    controllers: [VenuesController, VenuesAuthenticatedController],
    providers: [VenuesService]
})
export class VenuesModule {
}
