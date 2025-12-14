import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { UsersModules } from '../users/users.modules';

@Module({
  imports: [UsersModules],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
