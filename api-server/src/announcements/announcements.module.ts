import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnnouncementModel } from './models/announcement.model';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import UsersService from '../users/users.service';
import { UserModel } from '../users/models/user.model';
import { VenueModel } from '../venues/models/venue.model';

@Module({
  imports: [
    SequelizeModule.forFeature([AnnouncementModel, UserModel, VenueModel]),
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, UsersService],
})
export class AnnouncementsModule {}
