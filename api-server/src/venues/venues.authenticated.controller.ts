import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Header,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { AdminAuthGuard } from '../authentication/auth-guards/admin-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SingleVenueResponse } from './dto/single-venue-response';
import { VenuesService } from './venues.service';
import FindByIdParams from '../dto/find-by-id-params';
import { UpdateVenueRequest } from './dto/create-update-venue-request';
import { AssociateVenuePartnerRequest } from './dto/associate-venue-partner-request';
import isNullUndefinedOrEmpty from '../utils/isNullUndefinedOrEmpty';
import { venueModelToVenueDTO } from './dto/venue-model-to-venue-dto';

@Controller(`${VERSION_1_URI}/authenticated/venues`)
@ApiTags('venues -- authenticated')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: 403, description: 'Forbidden' })
export default class VenuesAuthenticatedController {
  constructor(private readonly venuesService: VenuesService) {}

  @Delete('/:id')
  @Header('content-type', 'application/json')
  @ApiOperation({ summary: 'soft deletes an existing venue' })
  @ApiResponse({
    status: 200,
    description: 'state of the soft deleted venue',
    type: SingleVenueResponse,
  })
  public softDeleteVenue(
    @Param() params: FindByIdParams,
  ): Promise<SingleVenueResponse> {
    const { id } = params;

    return this.venuesService
      .softDelete(id)
      .then((venue) => new SingleVenueResponse({ venue: venueModelToVenueDTO(venue) }));
  }

  @Put('/:id/activate')
  @Header('content-type', 'application/json')
  @ApiOperation({ summary: 'undoes a soft delete of an existing venue' })
  @ApiResponse({
    status: 200,
    description: 'state of the reactivated venue',
    type: SingleVenueResponse,
  })
  public reactivateVenue(
    @Param() params: FindByIdParams,
  ): Promise<SingleVenueResponse> {
    const { id } = params;

    return this.venuesService
      .reactivate(id)
      .then((venue) => new SingleVenueResponse({ venue: venueModelToVenueDTO(venue) }));
  }

  @Put('/:id')
  @Header('content-type', 'application/json')
  @ApiOperation({ summary: 'updates an existing venue' })
  @ApiResponse({
    status: 200,
    description: 'updated venue state',
    type: SingleVenueResponse,
  })
  public updateVenue(
    @Param() params: FindByIdParams,
    @Body() updatedValues: UpdateVenueRequest,
  ): Promise<SingleVenueResponse> {
    if (isNullUndefinedOrEmpty(updatedValues)) {
      throw new BadRequestException('No values supplied for the update');
    }

    const { id } = params;

    return this.venuesService.update(id, updatedValues).then((venue) => {
      return new SingleVenueResponse({ venue: venueModelToVenueDTO(venue) });
    });
  }

  @Post('partner-associate')
  @ApiOperation({ summary: 'Associate a venue with a partner (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Venue successfully associated with partner',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue or partner not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Venue is already associated with this partner',
  })
  async associateVenueWithPartner(
    @Body() request: AssociateVenuePartnerRequest,
  ): Promise<{ status: string; message: string }> {
    await this.venuesService.associateVenueWithPartner(request);

    return {
      status: 'success',
      message: `Venue ${request.venue_id} successfully associated with partner ${request.partner_id}`,
    };
  }

  @Post('partner-disassociate')
  @ApiOperation({
    summary: 'Remove association between a venue and a partner (admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Venue successfully disassociated from partner',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Venue or partner not found, or association does not exist',
  })
  async disassociateVenueFromPartner(
    @Body() request: AssociateVenuePartnerRequest,
  ): Promise<{ status: string; message: string }> {
    await this.venuesService.disassociateVenueFromPartner(request);

    return {
      status: 'success',
      message: `Venue ${request.venue_id} successfully disassociated from partner ${request.partner_id}`,
    };
  }
}
