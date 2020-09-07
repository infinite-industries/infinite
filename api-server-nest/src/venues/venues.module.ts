import {Module} from "@nestjs/common";
import {VenuesController} from "./venues.controller";
import {VenuesService} from "./venues.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Venue} from "./dto/venue.model";

@Module({
    imports: [
        SequelizeModule.forFeature([Venue])
    ],
    controllers: [VenuesController],
    providers: [VenuesService]
})
export class VenuesModule {
}
