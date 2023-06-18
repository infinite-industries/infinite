import {Controller, Get, Header, Query } from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import CalendaringService from "./calendaring.service";

@Controller(`${VERSION_1_URI}/calendaring`)
@ApiTags('calendaring')
export class CalendaringController {
    constructor(private calendaringService: CalendaringService) {
    }

    @Get('create-ics-file')
    @Header('content-type', 'text/calendar')
    @Header('content-disposition', 'attachment; filename="infinite_event.ics"')
    @ApiOperation({summary: 'create an ics file for use by calendaring applications'})
    @ApiResponse({
        status: 200,
        description: 'ics file',
        type: String
    })
    async getAllCurrentVerified(
        @Query('title') title: string,
        @Query('time_start') dtStart: string,
        @Query('time_end') dtEnd: string,
        @Query('description') description: string,
        @Query('location') location?: string
    ): Promise<string> {
        return this.calendaringService.generateICSFileText(title, dtStart, dtEnd, description, location);
    }
}
