import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { PartnerDTO } from './dto/partner-dto';

@Controller(`${VERSION_1_URI}/partners`)
@ApiTags('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('name/:name')
  @ApiOperation({
    summary: 'Get a partner by name',
    description:
      'Retrieves a partner by their name. This endpoint is publicly accessible and does not require authentication.',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the partner to retrieve',
    example: 'TechCorp Inc.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Partner found successfully',
    type: PartnerDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Partner not found',
  })
  async findByName(@Param('name') name: string): Promise<PartnerDTO> {
    const partner = await this.partnersService.findByName(name);

    if (!partner) {
      throw new NotFoundException(`Partner with name "${name}" not found`);
    }

    return new PartnerDTO(partner);
  }
}
