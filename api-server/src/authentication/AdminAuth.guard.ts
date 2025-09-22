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
export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const userInformation: UserInformation = await parseJwt(request);

      request.userInformation = userInformation;

      return userInformation.isInfiniteAdmin;
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
    }
  }
}
