import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../authentication/AdminAuth.guard';
import isAdminUser from '../authentication/is-admin-user';
import { PartnersService } from './partners.service';
import { CreatePartnerRequest } from './dto/create-partner-request';
import { AssociateUserPartnerRequest } from './dto/associate-user-partner-request';
import { PartnerDTO } from './dto/partner-dto';
import { PartnersListResponse } from './dto/partners-list-response';
import { Request } from 'express';

const FORBIDDEN_ERROR_MESSAGE = 'User does not have admin privileges';

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
  async getAll(@Req() request: Request): Promise<PartnersListResponse> {
    const isAdmin = await isAdminUser(request);
    if (!isAdmin) {
      throw new ForbiddenException(FORBIDDEN_ERROR_MESSAGE);
    }

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
    @Req() request: Request,
  ): Promise<PartnerDTO> {
    const isAdmin = await isAdminUser(request);
    if (!isAdmin) {
      throw new ForbiddenException(FORBIDDEN_ERROR_MESSAGE);
    }

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
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const isAdmin = await isAdminUser(request);
    if (!isAdmin) {
      throw new ForbiddenException(FORBIDDEN_ERROR_MESSAGE);
    }

    await this.partnersService.associateUserWithPartner(associateRequest);
    
    return {
      message: `User ${associateRequest.user_id} successfully associated with partner ${associateRequest.partner_id}`,
    };
  }
}
