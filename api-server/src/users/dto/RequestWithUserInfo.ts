import { Request } from 'express';
import { UserInfoResp } from './user-info-resp';

// This extends with built-in request interface with type information about
// the current user. We affix this to the request via the user-information-middleware
// so that when a user is authenticated this info will be available on all requests
export interface RequestWithUserInfo extends Request {
  userInformation?: UserInfoResp;
}
