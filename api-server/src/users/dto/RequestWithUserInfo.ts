import { Request } from 'express';
import { UserInformation } from '../../authentication/parse-jwt';

export interface RequestWithUserInfo extends Request {
  userInformation: UserInformation;
}
