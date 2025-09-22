import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from './start-database';
import { VenueModel } from '../../../src/venues/models/venue.model';
import { EventModel } from '../../../src/events/models/event.model';
import { EventsService } from '../../../src/events/events.service';
import { VenuesService } from '../../../src/venues/venues.service';
import { AnnouncementModel } from '../../../src/announcements/models/announcement.model';
import { AnnouncementsService } from '../../../src/announcements/announcements.service';
import { PartnerModel } from '../../../src/users/models/partner.model';
import { UserModel } from '../../../src/users/models/user.model';
import BitlyService from '../../../src/events/bitly.service';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { DatetimeVenueModel } from '../../../src/events/models/datetime-venue.model';
import { EventAdminMetadataModel } from '../../../src/events/models/event-admin-metadata.model';
import { SEQUELIZE_LOGGING } from '../../../src/constants';
import { GpsService } from '../../../src/venues/gps.services';

const NUXT_INTERNAL_POSTFIX = 'Repository';

async function buildDbConnectionsForTests(
  dbPort: number,
): Promise<DatabaseModels> {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [
      SequelizeModule.forRoot({
        dialect: 'postgres',
        autoLoadModels: true,
        synchronize: true,
        host: DB_HOST,
        port: dbPort,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        logging: SEQUELIZE_LOGGING,
        models: [
          VenueModel,
          EventModel,
          AnnouncementModel,
          DatetimeVenueModel,
          EventAdminMetadataModel,
          PartnerModel,
          UserModel,
        ],
      }),
      SequelizeModule.forFeature([
        EventModel,
        VenueModel,
        AnnouncementModel,
        DatetimeVenueModel,
        EventAdminMetadataModel,
        PartnerModel,
        UserModel,
      ]),
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
    ],
    providers: [
      EventsService,
      VenuesService,
      AnnouncementsService,
      BitlyService,
      GpsService,
    ],
  }).compile();

  const eventModel = testingModule.get(
    `EventModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof EventModel;
  const venueModel = testingModule.get(
    `VenueModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof VenueModel;
  const announcementModel = testingModule.get(
    `AnnouncementModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof AnnouncementModel;
  const datetimeVenueModel = testingModule.get(
    `DatetimeVenueModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof DatetimeVenueModel;
  const partnerModel = testingModule.get(
    `PartnerModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof PartnerModel;
  const userModel = testingModule.get(
    `UserModel${NUXT_INTERNAL_POSTFIX}`,
  ) as typeof UserModel;

  return {
    eventModel,
    venueModel,
    datetimeVenueModel,
    announcementModel,
    partnerModel,
    userModel,
    testingModule,
  };
}

export default buildDbConnectionsForTests;

export type DatabaseModels = {
  eventModel: typeof EventModel;
  venueModel: typeof VenueModel;
  datetimeVenueModel: typeof DatetimeVenueModel;
  announcementModel: typeof AnnouncementModel;
  partnerModel: typeof PartnerModel;
  userModel: typeof UserModel;
  testingModule: TestingModule;
};
