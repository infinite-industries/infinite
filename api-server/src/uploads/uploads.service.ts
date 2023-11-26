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
import sharp, { Sharp } from 'sharp';

const IMAGE_EXTENSION = 'webp';
const IMAGE_DESIRED_WIDTH = 1920;

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

  async saveImage(img: Express.Multer.File) {
    const resizedImage = await this.resizeAndCompress(img);

    if (isNullOrUndefined(AWS_S3_UPLOADS_BUCKET)) {
      console.debug(
        'using local drive to persist image uploads, this should only be used for local testing',
      );

      return this.saveToLocal(resizedImage);
    } else {
      return this.saveToS3(resizedImage);
    }
  }

  private async resizeAndCompress(
    imgFile: Express.Multer.File,
  ): Promise<Buffer> {
    let imageInProcess: Sharp = sharp(imgFile.buffer);

    const { width } = await imageInProcess.metadata();

    if (width > IMAGE_DESIRED_WIDTH) {
      imageInProcess = imageInProcess.resize(IMAGE_DESIRED_WIDTH);
    }

    return imageInProcess.webp().toBuffer();
  }

  private saveToLocal(imgBuffer: Buffer): Promise<string> {
    const subPath = 'event-images';

    return new Promise((resolve, reject) => {
      const imageName = this.generateNewImageName();

      // wx flag mitigates the possibility of clobbering an existing file
      // (will error out on write)
      fs.writeFile(
        join(PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS, imageName),
        imgBuffer,
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

  private async saveToS3(imageBuffer: Buffer): Promise<string> {
    const s3 = new S3({ region: AWS_REGION });

    const imageName = `uploads/${this.generateNewImageName()}`;

    try {
      await s3.putObject({
        Body: imageBuffer,
        Bucket: AWS_S3_UPLOADS_BUCKET,
        Key: imageName,
      });

      return `https://${AWS_S3_UPLOADS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${imageName}`;
    } catch (ex) {
      this.logger.error(
        `failed to upload an image to S3: "${imageName}" -> bucket: "${AWS_S3_UPLOADS_BUCKET}"`,
      );
      throw ex;
    }
  }

  private generateNewImageName(): string {
    const newImageId = uuid();
    return `${newImageId}.${IMAGE_EXTENSION}`;
  }
}
