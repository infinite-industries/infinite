import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventModel } from './models/event.model';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import BitlyService from './bitly.service';
import EventsAuthenticatedController from './events.authenticated.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { DatetimeVenueModel } from './models/datetime-venue.model';
import { EventAdminMetadataModel } from './models/event-admin-metadata.model';
import { VenueModel } from '../venues/models/venue.model';
import { PartnerModel } from '../users/models/partner.model';
import ExistingEventDetectionService from './existing-event-detection-service';
import { ExistingEventDetectionController } from './existing-event-detection-controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EventModel,
      DatetimeVenueModel,
      EventAdminMetadataModel,
      VenueModel,
      PartnerModel,
    ]),
    NotificationsModule,
  ],
  controllers: [
    ExistingEventDetectionController,
    EventsAuthenticatedController,
    EventsController,
  ],
  providers: [EventsService, BitlyService, ExistingEventDetectionService],
})
export class EventsModule {}
