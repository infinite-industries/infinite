import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import UsersService from '../users/users.service';
import { RequestWithUserInfo } from '../users/dto/RequestWithUserInfo';

/**
 * User Information Middleware
 *
 * This middleware attempts to parse user information from the request token
 * and attaches it to the request object. Unlike guards, this middleware:
 * - Always allows the request to proceed (no access control)
 * - Silently handles authentication failures
 * - Sets userInformation to undefined if no valid token is present
 *
 */
@Injectable()
export class UserInformationMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly userService: UsersService,
  ) {}

  async use(request: RequestWithUserInfo, res: Response, next: NextFunction) {
    try {
      this.logger.debug('running user-information middleware for request');
      // Set userInformation on the request if we successfully parsed it
      request.userInformation = await this.userService.ensureCurrentUserByName(
        request,
      );
    } catch (ex) {
      // We run this for all request authenticated or not, if there was parse
      // error it was already logged and rethrown by ensureCurrentUserByName,
      // we can ignore it here
      this.logger.debug(`User information parsing failed: ${ex.message}`);
    }

    next();
  }
}
