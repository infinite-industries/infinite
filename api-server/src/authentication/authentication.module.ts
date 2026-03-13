import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModules } from '../users/users.modules';
import { TestPartnerService } from './test-partner.service';

@Module({
  imports: [UsersModules],
  controllers: [AuthenticationController],
  providers: [TestPartnerService],
})
export class AuthenticationModule {}
