import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {VenuesModule} from "./venues/venues.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {CurrentEventsModule} from "./current-events/current-events.module";
import {AppController} from "./app.controller";
import {EventsModule} from "./events/events.module";
import { ConfigModule } from '@nestjs/config';
import {AnnouncementsModule} from "./announcements/announcements.module";
import {UsersModules} from "./users/users.modules";
import { NotificationsModule } from './notifications/notifications.module';
import LoggingMiddleware from "./logging/logging.middleware";
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston'
import {CalendaringModule} from "./calendaring/calendaring.module";
import {AuthenticationModule} from "./authentication/authentication.module";

require('dotenv').config();

const isSequelizeLoggingEnabled = !!process.env.SEQUELIZE_LOGGING
const isUsingSSL = (process.env.SQL_IS_USING_SSL || '').toLowerCase() === 'true';

const dialectOptions = isUsingSSL
    ?
        {
            ssl: {
                require: true
            }
        }
    : undefined;

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                '.env.test',
                '.env'
            ]
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            autoLoadModels: true,
            synchronize: true,
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER_NAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            logging: isSequelizeLoggingEnabled,
            ssl: isUsingSSL,
            dialectOptions

        }),
        WinstonModule.forRoot({
            transports: [
                // TODO: should we factor this out into a secondary file?
                new transports.Console({
                    format: format.combine(
                        format.label({ label: `TEST:api-server:${process.pid}` }),
                        format.timestamp(),
                        format.colorize(),
                        format.printf(({ level, message, label, timestamp }) => {
                            return `${level}: ${timestamp} [${label}] -- ${message}`;
                        })
                    )
                })
            ]
        }),
        NotificationsModule,
        VenuesModule,
        CurrentEventsModule,
        EventsModule,
        AnnouncementsModule,
        UsersModules,
        CalendaringModule,
        AuthenticationModule
    ],
    controllers: [AppController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggingMiddleware)
            .forRoutes('/**')
    }
}
