import {Module} from "@nestjs/common";
import CalendaringService from "./calendaring.service";
import {CalendaringController} from "./calendaring.controller";

@Module({
    controllers: [CalendaringController],
    providers: [CalendaringService]
})
export class CalendaringModule {
}
