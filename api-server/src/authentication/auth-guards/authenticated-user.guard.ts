import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import isNotNullOrUndefined from '../../utils/is-not-null-or-undefined';

// Only check if user is authenticated, not if they're admin
@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return isNotNullOrUndefined(request.userInformation);
  }
}
