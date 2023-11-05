import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import mkdirp from 'mkdirp';

export const PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS = resolve(
  join(__dirname, 'static', 'event-images'),
);

// in theory this should exist, but sometimes this is executed from /dist and doesn't get copied
mkdirp.sync(PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS);

@Module({
  imports: [
    // static file server for serving local image uploads (you should really only use this upload strategy for local dev)
    ServeStaticModule.forRoot({
      rootPath: PATH_TO_LOCAL_EVENT_IMAGE_UPLOADS + '/',
      serveRoot: '/uploads/event-images',
      serveStaticOptions: { index: false },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
