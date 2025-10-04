import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../authentication/auth-guards/admin-auth.guard';
import { PartnersService } from './partners.service';
import { CreatePartnerRequest } from './dto/create-partner-request';
import { AssociateUserPartnerRequest } from './dto/associate-user-partner-request';
import { PartnerDTO } from './dto/partner-dto';
import { PartnersListResponse } from './dto/partners-list-response';

@Controller(`${VERSION_1_URI}/authenticated/partners`)
@UseGuards(AdminAuthGuard)
@ApiTags('partners -- authenticated')
@ApiBearerAuth()
@ApiResponse({ status: 403, description: 'Forbidden' })
export class PartnersAuthenticatedController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all partners (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all partners',
    type: PartnersListResponse,
  })
  async getAll(): Promise<PartnersListResponse> {
    const partners = await this.partnersService.findAll();
    return new PartnersListResponse(partners);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new partner (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Partner created successfully',
    type: PartnerDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - partner with this name already exists',
  })
  async create(
    @Body() createPartnerRequest: CreatePartnerRequest,
  ): Promise<PartnerDTO> {
    const partner = await this.partnersService.create(createPartnerRequest);
    return new PartnerDTO(partner);
  }

  @Post('associate')
  @ApiOperation({ summary: 'Associate a user with a partner (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User successfully associated with partner',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'User or partner not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already associated with this partner',
  })
  async associateUserWithPartner(
    @Body() associateRequest: AssociateUserPartnerRequest,
  ): Promise<{ status: string; message: string }> {
    await this.partnersService.associateUserWithPartner(associateRequest);

    return {
      status: 'success',
      message: `User ${associateRequest.user_id} successfully associated with partner ${associateRequest.partner_id}`,
    };
  }
}
