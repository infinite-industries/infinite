import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUserInfo } from '../../users/dto/RequestWithUserInfo';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // user information set by user-information.middleware
    const request: RequestWithUserInfo = context.switchToHttp().getRequest();
    return request.userInformation?.isInfiniteAdmin;
  }
}
