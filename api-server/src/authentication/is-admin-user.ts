import { Request } from 'express';
import { parseJwt, UserInformation } from './parse-jwt';

async function isAdminUser(req: Request): Promise<boolean> {
  try {
    const userInformation: UserInformation = await parseJwt(req);

    console.log(
      '!!! userInformation: ' + JSON.stringify(userInformation, null, 4),
    );
    return userInformation.isInfiniteAdmin;
  } catch (ex) {
    return false;
  }
}

export default isAdminUser;
