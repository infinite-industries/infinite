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
import {SEQUELIZE_LOGGING, SQL_IS_USING_SSL} from "./constants";

require('dotenv').config();

const dialectOptions = SQL_IS_USING_SSL
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
            logging: SEQUELIZE_LOGGING,
            ssl: SQL_IS_USING_SSL,
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
