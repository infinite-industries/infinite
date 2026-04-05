import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModules } from '../users/users.modules';
import { VenuesModule } from '../venues/venues.module';
import { TestPartnerService } from './test-partner.service';

@Module({
  imports: [UsersModules, VenuesModule],
  controllers: [AuthenticationController],
  providers: [TestPartnerService],
})
export class AuthenticationModule {}
