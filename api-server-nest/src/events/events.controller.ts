import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {EventsService} from "./events.service";
import {Event} from "./models/event.model";
import {AuthGuard} from "../authentication/auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";
import {LoggingInterceptor} from "../logging/logging.interceptor";
import {getOptionsForEventsServiceFromEmbedsQueryParam} from "../utils/get-options-for-events-service-from-embeds-query-param";
import {mapDateTimesToIso} from "../utils/map-date-times-to-iso";
import {CreateEventRequest} from "./dto/create-event-request";
import {UpdateEventRequest} from "./dto/update-event-request";
import {ApiImplicitParam} from "@nestjs/swagger/dist/decorators/api-implicit-param.decorator";

@Controller(`${VERSION_1_URI}/events`)
@UseInterceptors(LoggingInterceptor)
@ApiTags('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {
    }

    @Get('verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events that have been verified (for public consumptions)'})
    @ApiResponse({
        status: 200,
        description: 'verified events',
        type: Event,
        isArray: true
    })
    getAllCurrentVerified(@Query('embed') embed: string[] | string = []): Promise<Event []> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: {verified: true}
        };

        return this.eventsService.findAll(findOptions);
    }

    @Get('non-verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get events that have not yet been verified (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrentNonVerified(@Query('embed') embed: string[] | string = []): Promise<Event []> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: {verified: false}
        };

        return this.eventsService.findAll(findOptions);
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get events, both verified and non (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrent(@Query('embed') embed: string[] | string = []): Promise<Event []> {
        const findOptions = getOptionsForEventsServiceFromEmbedsQueryParam(embed);

        return this.eventsService.findAll(findOptions);
    }

    @Put('/verify/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Verify the event, making it visible to the public' })
    @ApiImplicitParam({ name: 'id', type: String })
    @ApiResponse({ status:  403, description: "Forbidden" })
    @ApiBearerAuth()
    verifyEvent(@Param() params: { id: string }): Promise<Event> {
        const id = params.id

        return this.eventsService.update(id, { verified: true })
            .then(response => response.updatedEntities[0])
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update fields on an existing event' })
    @ApiResponse({ status:  403, description: "Forbidden" })
    @ApiBearerAuth()
    updateEvent(
        @Param() params: { id: string },
        @Body() updatedValues: UpdateEventRequest
    ): Promise<Event> {
        const id = params.id

        // TODO (CAW) -- This needs to happen here too
        // const eventWithDateTimesInISOFormat = mapDateTimesToIso(newEvent)

        return this.eventsService.update(id, updatedValues)
            .then(response => response.updatedEntities[0])
    }

    @Post()
    @ApiOperation({ summary: 'Create a new event. It will be initially un-verified' })
    createUnverifiedEvent(@Body() newEvent: CreateEventRequest): Promise<Event> {

        const eventWithDateTimesInISOFormat = mapDateTimesToIso(newEvent)

        return this.eventsService.create(eventWithDateTimesInISOFormat);
    }
}
