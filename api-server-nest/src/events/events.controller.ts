import {Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {EventsService} from "./events.service";
import {Event} from "./models/event.model";
import {AuthGuard} from "../authentication/auth.guard";
import { Inject, LoggerService } from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";
import {getOptionsForEventsServiceFromEmbedsQueryParam} from "../utils/get-options-for-events-service-from-embeds-query-param";
import getCommonQueryTermsForEvents from "../utils/get-common-query-terms-for-events";
import {mapDateTimesToIso} from "../utils/map-date-times-to-iso";
import {CreateEventRequest} from "./dto/create-event-request";
import SlackNotificationService, {EVENT_SUBMIT} from "./slack-notification.service";
import {EventsResponse} from "./dto/events-response";
import {SingleEventResponse} from "./dto/single-event-response";
import {Request} from "express";
import {removeSensitiveDataForNonAdmins} from "../authentication/filters/remove-sensitive-data-for-non-admins";
import FindByIdParams from "../dto/find-by-id-params";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

require('dotenv').config()

const env = process.env.ENV || 'dev'

@Controller(`${VERSION_1_URI}/events`)
@ApiTags('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly slackNotificationService: SlackNotificationService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) {}


    @Get('verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events that have been verified (for public consumptions)'})
    @ApiResponse({
        status: 200,
        description: 'verified events',
        type: EventsResponse
    })
    getAllCurrentVerified(
        @Query('embed') embed: string[] | string = [],
        @Query('tags') tags: string[] | string = [],
    ): Promise<EventsResponse> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: getCommonQueryTermsForEvents(true, tags)
        };

        return this.eventsService.findAll(findOptions)
            .then(events => new EventsResponse({ events }));
    }

    @Get('non-verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get events that have not yet been verified (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrentNonVerified(
        @Query('embed') embed: string[] | string = [],
        @Query('tags') tags: string[] | string = []
    ): Promise<EventsResponse> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: {verified: false}
        };

        return this.eventsService.findAll(findOptions)
            .then(events => new EventsResponse({events}));
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get single event by id'})
    @ApiResponse({
        status: 200,
        description: 'get single event',
    })
    getEventById(
        @Param() params: FindByIdParams,
        @Query('embed') embed: string[] | string = [],
        @Req() request: Request
    ): Promise<SingleEventResponse> {
        const id = params.id
        const findOptions  = getOptionsForEventsServiceFromEmbedsQueryParam(embed)

        return this.eventsService.findById(id, findOptions)
            .then(event => Promise.resolve(event))
            .then(event => removeSensitiveDataForNonAdmins(request, event))
            .then(event =>  Promise.resolve(event))
            .then((event: Event) => ({ event, status: 'success' }))
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get events, both verified and non (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrent(
        @Query('embed') embed: string[] | string = [],
        @Query('tags') tags: string[] | string = [],
    ): Promise<EventsResponse> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: getCommonQueryTermsForEvents(null, tags)
        };

        return this.eventsService.findAll(findOptions)
            .then(events => new EventsResponse({ events }));
    }

    @Post()
    @ApiOperation({summary: 'Create a new event. It will be initially un-verified'})
    async createUnverifiedEvent(@Body() newEvent: CreateEventRequest): Promise<Event> {
        const eventWithDateTimesInISOFormat = mapDateTimesToIso<CreateEventRequest>(newEvent, CreateEventRequest)

        const submissionResult = await this.eventsService.create(eventWithDateTimesInISOFormat)

        this.notifyViaSlackAboutNewEvent(submissionResult)

        return submissionResult
    }

    private notifyViaSlackAboutNewEvent(newEvent: Event) {
        try {

            const eventPojo = (newEvent as any ).dataValues

            const eventData: string = JSON.stringify(eventPojo, null, 4)
            const messagePrefix = `(${env}) Review Me. Copy Me. Paste Me. Deploy Me. Love Me.:\n`
            const message = eventData + messagePrefix

            this.slackNotificationService.sendNotification(EVENT_SUBMIT, message)
        } catch (exSlack) {
            this.logger.error(`error notifying slack of new event: ${exSlack}`)
        }
    }
}
