import {Controller, Get, Header, Post, Body} from "@nestjs/common";
import {VenuesService} from "./venues.service";
import {Venue} from "./dto/venue.model";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VERSION_1_URI} from "../utils/versionts";

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
        type: Venue,
        isArray: true
    })
    getAll(): Promise<Venue []> {
        return this.venuesService.findAll();
    }

    @Post()
    @Header('content-type', 'application/json')
    @ApiOperation({summary: 'create a new venue'})
    @ApiResponse({
        status: 200,
        description: 'create a venue',
        type: Venue
    })
    create(@Body() venue: Venue): Promise<Venue> {
        return this.venuesService.create(venue);
    }
}
