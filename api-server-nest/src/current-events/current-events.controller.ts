import {Controller, Get, Query, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {CurrentEventsService} from "./current-events.service";
import {AuthGuard} from "../authentication/auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";
import {CurrentEventsResponse} from "./dto/current-events-response";
import {getOptionsForEventsServiceFromEmbedsQueryParam} from "../utils/get-options-for-events-service-from-embeds-query-param";
import getCommonQueryTermsForEvents from "../utils/get-common-query-terms-for-events";
import {Request} from "express";
import {CurrentEvent} from "./models/current-event.model";
import {removeSensitiveDataForNonAdmins} from "../authentication/filters/remove-sensitive-data-for-non-admins";

@Controller(`${VERSION_1_URI}/current-events`)
@ApiTags('current events')
export class CurrentEventsController {
    constructor(private readonly currentEventsService: CurrentEventsService) {}

    @Get('verified')
    @ApiOperation({summary: 'Get current events that have been verified (for public consumptions)'})
    @ApiResponse({
        status: 200,
        description: 'Current verified events',
        type: CurrentEventsResponse,
        isArray: true
    })
    async getAllCurrentVerified(
        @Query('embed') embed: string[] | string = [],
        @Query('tags') tags: string[] | string = [],
        @Req() request: Request
    ): Promise<CurrentEventsResponse> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: getCommonQueryTermsForEvents(true, tags)
        };

        return this.currentEventsService.findAll(findOptions)
            .then(events => removeSensitiveDataForNonAdmins(request, events))
            .then((filteredEvents: CurrentEvent[]) => new CurrentEventsResponse({ events: filteredEvents}))
    }

    @Get('non-verified')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events that have not yet been verified (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrentNonVerified(
        @Query('embed') embed: string[] | string = [],
        @Query('tags') tags: string[] | string = []
    ): Promise<CurrentEventsResponse> {
        const findOptions = {
            ...getOptionsForEventsServiceFromEmbedsQueryParam(embed),
            where: getCommonQueryTermsForEvents(false, tags)
        };

        return this.currentEventsService.findAll(findOptions)
            .then((events: CurrentEvent[]) => new CurrentEventsResponse({ events }));
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get current events, both verified and non (admin only)'})
    @ApiResponse({status: 403, description: 'Forbidden'})
    @ApiBearerAuth()
    getAllCurrent(@Query('embed') embed: string[] | string = []): Promise<CurrentEventsResponse> {
        const findOptions = getOptionsForEventsServiceFromEmbedsQueryParam(embed)

        return this.currentEventsService.findAll(findOptions)
            .then(events => new CurrentEventsResponse({ events }));
    }
}
