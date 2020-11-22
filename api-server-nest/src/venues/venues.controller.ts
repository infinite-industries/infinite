import {Controller, Get, Header, Post, Body} from "@nestjs/common";
import {VenuesService} from "./venues.service";
import {VenueModel} from "./models/venue.model";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";
import {CreateVenueRequest} from "./dto/create-venue-request";
import {VenuesResponse} from "./dto/venues-response";

@Controller(`${VERSION_1_URI}/venues`)
@ApiTags('venues')
export class VenuesController {
    constructor(
        private readonly venuesService: VenuesService
    ) {
    }

    @Get()
    @ApiOperation({summary: 'get a list of all the venues'})
    @ApiResponse({
        status: 200,
        description: 'all venues',
        type: VenueModel,
        isArray: true
    })
    getAll(): Promise<VenuesResponse> {
        return this.venuesService.findAll()
            .then(venues => new VenuesResponse({ venues }));
    }

    @Post()
    @Header('content-type', 'application/json')
    @ApiOperation({summary: 'create a new venue'})
    @ApiResponse({
        status: 200,
        description: 'create a venue',
        type: VenueModel
    })
    create(@Body() venue: CreateVenueRequest): Promise<VenuesResponse> {
        return this.venuesService.create(venue)
            .then(venue => new VenuesResponse({ venues: [venue] }));
    }
}
