import { Controller, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsResponse } from '../events/dto/events-response';
import { Request } from 'express';
import { UploadsResponse } from './dto/UploadsResponse';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${VERSION_1_URI}/uploads`)
@ApiTags('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get('social-image')
  @ApiOperation({
    summary: 'uploads an image for reference by events',
  })
  @ApiResponse({
    status: 200,
    description: 'the path to the image on the server',
    type: EventsResponse,
  })
  @UseInterceptors(FileInterceptor('file'))
  getAllCurrentVerified(): Promise<UploadsResponse> {}
}
