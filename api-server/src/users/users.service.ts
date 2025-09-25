import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { PartnerModel } from './models/partner.model';
import NewUser, { buildFromUserInfo } from './dto/new-user';
import { v4 as uuidv4 } from 'uuid';
import { RequestWithUserInfo } from './dto/RequestWithUserInfo';
import { parseJwt, UserInformation } from '../authentication/parse-jwt';
import { UserInfoResp } from './dto/user-info-resp';
import { PartnerDTO } from './dto/partner-dto';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';

@Injectable()
export default class UsersService {
  constructor(@InjectModel(UserModel) private usersModel: typeof UserModel) {}

  async ensureCurrentUserByName(
    request: RequestWithUserInfo,
  ): Promise<UserInfoResp> {
    const userInfo: UserInformation = await parseJwt(request);

    // issue is likely unserInfomration on request
    console.log(
      '!!! request: ' + JSON.stringify(request.userInformation, null, 4),
    );
    const userInfoToPersist = buildFromUserInfo(userInfo);

    const persistedUserInfo = await this.ensureByName(userInfoToPersist);

    console.log('!!! userInfo: ' + JSON.stringify(userInfo, null, 4));
    console.log(
      '!!! persisted Info: ' + JSON.stringify(persistedUserInfo, null, 4),
    );
    // !!! TODO ALSO MAKE SURE WE STRIP EMAILS OR MAYBE NOT MAKE SURE WE SHOW THEM
    return new UserInfoResp({
      id: persistedUserInfo.id,
      name: userInfo.decodedToken.name,
      nickname: userInfo.decodedToken.nickname,
      isInfiniteAdmin: userInfo.isInfiniteAdmin,
      isOwnerAdmin: isNotNullOrUndefined(persistedUserInfo.partners)
        ? persistedUserInfo.partners.length > 0
        : false,
      venueIDs: userInfo.venueIds,
      partners:
        persistedUserInfo.partners?.map((partner) => new PartnerDTO(partner)) ||
        [],
    });
  }

  private async ensureByName(user: NewUser): Promise<UserModel> {
    const name = user.name;

    const userToInsert = {
      ...user,
      id: uuidv4(),
    };

    return this.usersModel
      .findOrCreate({
        where: { name },
        defaults: userToInsert,
        include: [
          {
            model: PartnerModel,
            as: 'partners',
            through: { attributes: [] }, // Exclude join table attributes
          },
        ],
      })
      .then((resp) => resp[0]);
  }
}
