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
import { PartnersListResponse } from './dto/partners-list-response';

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

    const persistedUserInfo = await this.userService.ensureByName(
      userInfoToPersist,
    );

    return new UserInfoResp({
      id: persistedUserInfo.id,
      name: userInfo.decodedToken.name,
      nickname: userInfo.decodedToken.nickname,
      isInfiniteAdmin: userInfo.isInfiniteAdmin,
      venueIDs: userInfo.venueIds,
      partners:
        persistedUserInfo.partners?.map((partner) => new PartnerDTO(partner)) ||
        [],
    });
  }

  @Get('current/partners')
  @UseGuards(AuthenticatedUserGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get partners associated with the authenticated user',
    description:
      'Returns a list of partners that are associated with the currently logged-in user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of partners associated with the user',
    type: PartnersListResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  async getPartnersForUser(
    @Req() request: RequestWithUserInfo,
  ): Promise<PartnersListResponse> {
    const userInfo: UserInformation = request.userInformation;
    const userInfoToPersist = buildFromUserInfo(userInfo);

    const persistedUserInfo = await this.userService.ensureByName(
      userInfoToPersist,
    );

    return new PartnersListResponse(
      persistedUserInfo.partners?.map((partner) => new PartnerDTO(partner)) ||
        [],
    );
  }
}

interface RequestWithUserInfo extends Request {
  userInformation: UserInformation;
}
