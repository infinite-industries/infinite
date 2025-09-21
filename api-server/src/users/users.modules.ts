import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import UsersService from './users.service';
import { UserModel } from './models/user.model';
import { PartnerModel } from './models/partner.model';
import { PartnersService } from './partners.service';
import { PartnersAuthenticatedController } from './partners.authenticated.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserModel, PartnerModel])],
  controllers: [UsersController, PartnersAuthenticatedController],
  providers: [UsersService, PartnersService],
})
export class UsersModules {}

// Export models for use in other modules
export { UserModel, PartnerModel };
