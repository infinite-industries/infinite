import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import registerSwaggerDocsModule from "./registerSwaggerDocsModule";
import {isNullOrUndefined} from "./utils";
import {ValidationPipe} from "@nestjs/common";

require('dotenv').config();

const DEFAULT_PORT = 3000;
const PORT = isNullOrUndefined(process.env.PORT) ? DEFAULT_PORT : process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));

    registerSwaggerDocsModule(app);

    await app.listen(PORT);

    console.info('application listening on port ', PORT);
}

bootstrap();
