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
import fs from 'fs';
import { join, resolve } from 'path';
import { INFINITE_API_BASE_URL } from '../constants';
import { v4 as uuid } from 'uuid';
import { PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS } from './uploads.module';

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
    const imagePath = await this.saveToLocal(file);

    const resp = new UploadsResponse({ imagePath });
    return resp;
  }

  private saveToLocal(img: Express.Multer.File): Promise<string> {
    const subPath = 'event-images';

    return new Promise((resolve, reject) => {
      const newImageId = uuid();
      const imageName = `${newImageId}.${getExtension(img)}`;

      // wx flag mitigates the possibility of clobbering an existing file
      // (will error out on write)
      fs.writeFile(
        join(PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS, imageName),
        img.buffer,
        { flag: 'wx' },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(`${INFINITE_API_BASE_URL}/uploads/${subPath}/${imageName}`);
          }
        },
      );
    });
  }
}

function getExtension(file: Express.Multer.File) {
  return file.mimetype.split('/')[1];
}
