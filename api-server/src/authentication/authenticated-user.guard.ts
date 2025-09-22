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
import { parseJwt, UserInformation } from './parse-jwt';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const userInformation: UserInformation = await parseJwt(request);

      request.userInformation = userInformation;

      // Only check if user is authenticated, not if they're admin
      return true;
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
    }
  }
}
