import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsResponse } from '../events/dto/events-response';
import { UploadsResponse } from './dto/UploadsResponse';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

const TEN_MEGABYTES = 10000000;

@Controller(`${VERSION_1_URI}/uploads`)
@ApiTags('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('event-image')
  @ApiOperation({
    summary: 'uploads an image for reference by events',
  })
  @ApiResponse({
    status: 200,
    description: 'the path to the image on the server',
    type: EventsResponse,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadEventImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: TEN_MEGABYTES }),
          // new FileTypeValidator({
          //   fileType: /\.(jpg|jpeg|png|webp|tif|tiff|bmp)$/i,
          // }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<UploadsResponse> {
    const imagePath = await this.uploadsService.saveImage(file);
    return new UploadsResponse({ imagePath });
  }
}
