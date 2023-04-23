import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VenuesModule } from './venues/venues.module';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { UsersModules } from './users/users.modules';
import { NotificationsModule } from './notifications/notifications.module';
import LoggingMiddleware from './logging/logging.middleware';
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
  SEQUELIZE_LOGGING,
  SQL_IS_USING_SSL,
} from './constants';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

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
            format.label({ label: `TEST:api-server:${process.pid}` }),
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
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('/**');
  }
}
