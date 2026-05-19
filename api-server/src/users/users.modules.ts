import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import UsersService from './users.service';
import { UserModel } from './models/user.model';
import { PartnerModel } from './models/partner.model';
import { PartnersService } from './partners.service';
import { PartnersAuthenticatedController } from './partners.authenticated.controller';
import { PartnersController } from './partners.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, PartnerModel]), UploadsModule],
  controllers: [
    UsersController,
    PartnersAuthenticatedController,
    PartnersController,
  ],
  providers: [UsersService, PartnersService],
  exports: [UsersService, PartnersService],
})
export class UsersModules { }

// Export models for use in other modules
export { UserModel, PartnerModel };
