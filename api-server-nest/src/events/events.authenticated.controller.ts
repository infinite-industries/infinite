import {Body, Controller, Get, Param, Put, UseGuards, UseInterceptors} from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../authentication/auth.guard"
import {SingleEventResponse} from "./dto/single-event-response";
import {EventsService} from "./events.service";
import {UpdateEventRequest} from "./dto/update-event-request";
import {Event} from "./models/event.model";
import {mapDateTimesToIso} from "../utils/map-date-times-to-iso";
import {ApiImplicitParam} from "@nestjs/swagger/dist/decorators/api-implicit-param.decorator";
import FindByIdParams from "../dto/find-by-id-params";

@Controller(`${VERSION_1_URI}/authenticated/events`)
@UseGuards(AuthGuard)
@ApiTags('events -- authenticated')
@ApiBearerAuth()
@ApiResponse({status: 403, description: "Forbidden"})
export default class EventsAuthenticatedController {

    constructor(private readonly eventsService: EventsService){}

    @Get("/:id")
    @ApiOperation({summary: 'Get a single event with no filters applied (authenticated only)'})
    @ApiResponse({
        status: 200,
        description: 'get single event',
    })
    getById(@Param() params: { id: string }): Promise<SingleEventResponse> {
        const id = params.id

        return this.eventsService.findById(id)
            .then(event => ({ event, status: 'success' }))
    }

    @Put(':id')
    @ApiOperation({summary: 'Update fields on an existing event'})
    @ApiImplicitParam({name: 'id', type: String})
    updateEvent(
        @Param() params: FindByIdParams,
        @Body() updatedValues: UpdateEventRequest
    ): Promise<Event> {
        const id = params.id;

        const eventWithDateTimesInISOFormat = mapDateTimesToIso<UpdateEventRequest>(updatedValues, UpdateEventRequest)

        return this.eventsService.update(id, eventWithDateTimesInISOFormat)
            .then(response => response.updatedEntities[0]);
    }

    @Put('/verify/:id')
    @ApiOperation({summary: 'Verify the event, making it visible to the public'})
    @ApiImplicitParam({name: 'id', type: String})
    verifyEvent(@Param() params: FindByIdParams): Promise<Event> {
        const id = params.id;

        return this.eventsService.update(id, {verified: true})
            .then(response => response.updatedEntities[0]);
    }
}
