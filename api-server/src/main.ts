import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import registerSwaggerDocsModule from './registerSwaggerDocsModule';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import {
  AUTH_USE_TEST_USERS,
  AUTH_USE_TEST_USERS_WARNING,
  PORT,
  ENV,
} from './constants';
import { json, urlencoded } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'x-access-token, content-type',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  registerSwaggerDocsModule(app);

  app.use(json({ limit: '50mb' }));
  app.use(
    urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }),
  );

  await app.listen(PORT);

  console.info('application listening on port ', PORT);

  if (AUTH_USE_TEST_USERS) {
    if (ENV === 'prod' || ENV === 'production') {
      console.error(
        'You should not start this service in production with AUTH_USE_TEST_USERS set',
      );
      process.exit(1);
    }

    console.warn(AUTH_USE_TEST_USERS_WARNING);
  }
}

bootstrap();
