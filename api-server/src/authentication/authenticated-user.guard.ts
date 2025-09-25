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
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import UsersService from '../users/users.service';

// Only check if user is authenticated, not if they're admin
@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const userInformation = await this.userService.ensureCurrentUserByName(
        request,
      );

      request.userInformation = userInformation;

      return isNotNullOrUndefined(userInformation);
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
    }
  }
}
