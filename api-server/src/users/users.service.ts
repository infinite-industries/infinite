import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { PartnerModel } from './models/partner.model';
import NewUser, { buildFromUserInfo } from './dto/new-user';
import { v4 as uuidv4 } from 'uuid';
import {
  getTokenFromHeader,
  parseJwt,
  UserInformation,
} from '../authentication/parse-jwt';
import { UserInfoResp } from './dto/user-info-resp';
import { PartnerDTO } from './dto/partner-dto';
import isNotNullOrUndefined from '../utils/is-not-null-or-undefined';
import { Request } from 'express';
import { Nullable } from '../utils/NullableOrUndefinable';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { isNullOrUndefined } from '../utils';

@Injectable()
export default class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectModel(UserModel) private usersModel: typeof UserModel,
  ) {}

  async ensureCurrentUserByName(
    request: Request,
  ): Promise<Nullable<UserInfoResp>> {
    if (isNullOrUndefined(getTokenFromHeader(request))) {
      // user is not authenticated, no need to do anything or log anything
      // this is fine :-)
      this.logger.debug('no user set -- unauthenticated request');
      return null;
    }

    let userInfo: UserInformation;
    try {
      userInfo = await parseJwt(request);

      this.logger.debug('successfully parsed jwt');
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException('invalid auth token', HttpStatus.FORBIDDEN);
    }

    const userInfoToPersist = buildFromUserInfo(userInfo);

    const persistedUserInfo = await this.ensureByName(userInfoToPersist);

    this.logger.log('userInformation set on request -- authenticated requests');
    return new UserInfoResp({
      id: persistedUserInfo.id,
      name: userInfo.decodedToken.name,
      nickname: userInfo.decodedToken.nickname,
      isInfiniteAdmin: userInfo.isInfiniteAdmin,
      isPartnerAdmin: isNotNullOrUndefined(persistedUserInfo.partners)
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
            through: { attributes: [] }, // Exclude join table attributes, for example owner_partner_id
          },
        ],
      })
      .then((resp) => resp[0]);
  }
}
