import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VenuesModule } from './venues/venues.module';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { UsersModules } from './users/users.modules';
import { NotificationsModule } from './notifications/notifications.module';
import LoggingMiddleware from './logging/logging.middleware';
import { UserInformationMiddleware } from './authentication/user-information.middleware';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { CalendaringModule } from './calendaring/calendaring.module';
import { AuthenticationModule } from './authentication/authentication.module';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER_NAME,
  ENV,
  SEQUELIZE_LOGGING,
  SQL_IS_USING_SSL,
} from './constants';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionLogger } from './logging/ExceptionLogger';
import { SummarizationModule } from './summarization/summarization.module';

const dialectOptions = SQL_IS_USING_SSL
  ? {
      ssl: {
        require: true,
      },
    }
  : undefined;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.test', '.env'],
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: true,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER_NAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      logging: SEQUELIZE_LOGGING,
      ssl: SQL_IS_USING_SSL,
      dialectOptions,
    }),
    WinstonModule.forRoot({
      transports: [
        // TODO: should we factor this out into a secondary file?
        new transports.Console({
          format: format.combine(
            format.label({ label: `${ENV}:api-server:${process.pid}` }),
            format.timestamp(),
            format.colorize(),
            format.printf(({ level, message, label, timestamp }) => {
              return `${level}: ${timestamp} [${label}] -- ${message}`;
            }),
          ),
        }),
      ],
    }),
    NotificationsModule,
    VenuesModule,
    EventsModule,
    AnnouncementsModule,
    UsersModules,
    CalendaringModule,
    AuthenticationModule,
    UploadsModule,
    SummarizationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionLogger,
    },
    UserInformationMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // for all routes, including root, attach user information to the request
      // and run request logging middleware
      .apply(UserInformationMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}
