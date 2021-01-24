import {Controller, Get, Param, UseGuards, UseInterceptors} from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {LoggingInterceptor} from "../logging/logging.interceptor";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../authentication/auth.guard"
import {SingleEventResponse} from "./dto/single-event-response";
import {EventsService} from "./events.service";

@Controller(`${VERSION_1_URI}/authenticated/events`)
@UseInterceptors(LoggingInterceptor)
@ApiTags('events -- authenticated')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export default class AuthenticatedEventsController {

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
}
