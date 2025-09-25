import { Request } from 'express';
import { UserInfoResp } from './user-info-resp';

export interface RequestWithUserInfo extends Request {
  userInformation: UserInfoResp;
}
