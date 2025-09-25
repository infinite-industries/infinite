import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import UsersService from '../users/users.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const userInformation = await this.userService.ensureCurrentUserByName(
        request,
      );

      request.userInformation = userInformation;

      return userInformation.isInfiniteAdmin;
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
    }
  }
}
