import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUserGuard } from '../authentication/authenticated-user.guard';
import { Request } from 'express';
import { UserInformation } from '../authentication/parse-jwt';
import UsersService from './users.service';
import { buildFromUserInfo } from './dto/new-user';
import { UserInfoResp } from './dto/user-info-resp';
import { PartnerDTO } from './dto/partner-dto';

@Controller(`${VERSION_1_URI}/users`)
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('current')
  @UseGuards(AuthenticatedUserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return information about the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'current user',
    type: UserInfoResp,
  })
  async getCurrentUser(
    @Req() request: RequestWithUserInfo,
  ): Promise<UserInfoResp> {
    const userInfo: UserInformation = request.userInformation;
    const userInfoToPersist = buildFromUserInfo(userInfo);

    // TODO There's no real need to persist user info to db at this point, this was done when we were going to have
    // user curated lists and such
    const persistedUserInfo = await this.userService.ensureByName(
      userInfoToPersist,
    );

    return new UserInfoResp({
      id: persistedUserInfo.id,
      name: userInfo.decodedToken.name,
      nickname: userInfo.decodedToken.nickname,
      isInfiniteAdmin: userInfo.isInfiniteAdmin,
      venueIDs: userInfo.venueIds,
      partners: persistedUserInfo.partners?.map(partner => new PartnerDTO(partner)) || [],
    });
  }
}

interface RequestWithUserInfo extends Request {
  userInformation: UserInformation;
}
