import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VenueModel } from './models/venue.model';
import { NotificationsModule } from '../notifications/notifications.module';
import VenuesAuthenticatedController from './venues.authenticated.controller';
import { GpsService } from './gps.services';

@Module({
  imports: [SequelizeModule.forFeature([VenueModel]), NotificationsModule],
  controllers: [VenuesController, VenuesAuthenticatedController],
  providers: [VenuesService, GpsService],
})
export class VenuesModule {}
