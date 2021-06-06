import {BadRequestException, Body, Controller, Delete, Header, Param, Put, UseGuards} from "@nestjs/common";
import {VERSION_1_URI} from "../utils/versionts";
import {AuthGuard} from "../authentication/auth.guard";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {SingleVenueResponse} from "./dto/single-venue-response";
import {VenuesService} from "./venues.service";
import FindByIdParams from "../dto/find-by-id-params";
import {UpdateVenueRequest} from "./dto/create-update-venue-request";
import {response} from "express";
import isNullUndefinedOrEmpty from "../utils/isNullUndefinedOrEmpty";

@Controller(`${VERSION_1_URI}/authenticated/venues`)
@ApiTags('venues -- authenticated')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({status: 403, description: "Forbidden"})
export default class VenuesAuthenticatedController {
    constructor(
        private readonly venuesService: VenuesService
    ) {}

    @Delete('/:id')
    @Header('content-type', 'application/json')
    @ApiOperation({summary: 'soft deletes an existing venue'})
    @ApiResponse({
        status: 200,
        description: 'state of the soft deleted venue',
        type: SingleVenueResponse
    })
    public softDeleteVenue(@Param() params: FindByIdParams): Promise<SingleVenueResponse> {
        const { id } = params;

        return this.venuesService.softDelete(id)
            .then(venue => new SingleVenueResponse({ venue }));
    }

    @Put('/:id')
    @Header('content-type', 'application/json')
    @ApiOperation({summary: 'updates an existing venue'})
    @ApiResponse({
        status: 200,
        description: 'updated venue state',
        type: SingleVenueResponse
    })
    public updateVenue(
        @Param() params: FindByIdParams,
        @Body() updatedValues: UpdateVenueRequest
    ): Promise<SingleVenueResponse> {
        if (isNullUndefinedOrEmpty(updatedValues)) {
            throw new BadRequestException('No values supplied for the update');
        }

        const { id } = params;

        return this.venuesService.update(id, updatedValues)
            .then((venue) => {
                return new SingleVenueResponse({ venue })
            });
    }
}
