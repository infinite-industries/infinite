import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiConsumes,
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
import { UploadsService } from '../uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${VERSION_1_URI}/authenticated/partners`)
@UseGuards(AdminAuthGuard)
@ApiTags('partners -- authenticated')
@ApiBearerAuth()
@ApiResponse({ status: 403, description: 'Forbidden' })
export class PartnersAuthenticatedController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly uploadsService: UploadsService,
  ) { }

  @Post(':id/logo')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a partner logo and attach it to the partner',
  })
  @ApiResponse({
    status: 200,
    description: 'Partner logo uploaded and partner updated successfully',
    type: PartnerDTO,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPartnerLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: 'light' | 'dark',
  ): Promise<PartnerDTO> {
    if (!['light', 'dark'].includes(type)) {
      throw new BadRequestException('type must be either "light" or "dark"');
    }
    const folder = `partner-${id}`;
    // Add uploaded timestamp to filename as cheap & nondestructive logo versioning
    const now = new Date();
    const datePart = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const timePart = now.toLocaleTimeString('en-GB').replace(/:/g, '-'); // HH-mm-ss
    const filepath =
      type === 'light'
        ? `light-logo-${datePart}_${timePart}`
        : `dark-logo-${datePart}_${timePart}`;
    const savedImagePath = await this.uploadsService.saveUncompressedImage(
      file,
      filepath,
      folder,
    );
    const partner = await this.partnersService.updatePartnerLogo(
      id,
      type,
      savedImagePath,
    );

    return new PartnerDTO(partner);
  }

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
