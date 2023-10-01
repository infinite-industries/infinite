import { Inject, Injectable, LoggerService } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';
import {
  AWS_REGION,
  AWS_S3_UPLOADS_BUCKET,
  INFINITE_API_BASE_URL,
} from '../constants';
import { v4 as uuid } from 'uuid';
import { PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS } from './uploads.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { isNullOrUndefined } from '../utils';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    if (isNullOrUndefined(AWS_S3_UPLOADS_BUCKET)) {
      this.logger.warn(
        'AWS_S3_UPLOADS_BUCKET is not defined. A local folder will be used for file uploads. This is not recommended for production.',
      );
    }
  }

  saveImage(img: Express.Multer.File) {
    if (isNullOrUndefined(AWS_S3_UPLOADS_BUCKET)) {
      return this.saveToLocal(img);
    } else {
      return this.saveToS3(img);
    }
  }

  private saveToLocal(img: Express.Multer.File): Promise<string> {
    const subPath = 'event-images';

    return new Promise((resolve, reject) => {
      const imageName = this.generateNewImageName(img);

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

  private async saveToS3(img: Express.Multer.File): Promise<string> {
    const s3 = new S3();

    const bucket = AWS_S3_UPLOADS_BUCKET;
    const region = AWS_REGION;

    const imageName = `event-images/${this.generateNewImageName(img)}`;

    try {
      const result = await s3.putObject({
        Body: img.buffer,
        Bucket: bucket,
        Key: imageName,
      });

      console.log('!!! RESULT:');
      console.log(result);

      return `https://${bucket}.s3.${region}.amazonaws.com/${imageName}`;
    } catch (ex) {
      this.logger.error(
        `failed to upload an image to S3: "${imageName}" -> bucket: "${bucket}"`,
      );
      throw ex;
    }
  }

  private generateNewImageName(img: Express.Multer.File): string {
    const newImageId = uuid();
    return `${newImageId}.${this.getExtension(img)}`;
  }

  private getExtension(file: Express.Multer.File) {
    return file.mimetype.split('/')[1];
  }
}
