import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import registerSwaggerDocsModule from "./registerSwaggerDocsModule";
import {isNullOrUndefined} from "./utils";
import {ValidationPipe} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {AUTH_USE_TEST_USERS,AUTH_USE_TEST_USERS_WARNING} from "./constants";

require('dotenv').config();

const DEFAULT_PORT = 3000;
const PORT = isNullOrUndefined(process.env.PORT) ? DEFAULT_PORT : process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false
    }));

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'x-access-token, content-type',
        credentials: true,
        optionsSuccessStatus: 204
    })

    registerSwaggerDocsModule(app);

    await app.listen(PORT);

    console.info('application listening on port ', PORT);

    if (AUTH_USE_TEST_USERS) {
        console.warn(AUTH_USE_TEST_USERS_WARNING)
    }
}

bootstrap();
