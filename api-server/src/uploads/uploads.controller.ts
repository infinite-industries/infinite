import {
  Controller,
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsResponse } from '../events/dto/events-response';
import { UploadsResponse } from './dto/UploadsResponse';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import EventImageMaxFileSizeValidator from './validators/EventImageMaxFileSizeValidator';
import EventImageFileTypeValidator from './validators/EventImageFileTypeValidator';

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
    @UploadedFile(getImageUploadValidators())
    file: Express.Multer.File,
  ): Promise<UploadsResponse> {
    const imagePath = await this.uploadsService.saveImage(file);
    return new UploadsResponse({ imagePath });
  }
}

function getImageUploadValidators(): ParseFilePipe {
  return new ParseFilePipeBuilder()
    .addValidator(new EventImageFileTypeValidator())
    .addValidator(new EventImageMaxFileSizeValidator())
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      fileIsRequired: true,
    });
}
