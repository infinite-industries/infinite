import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { VERSION_1_URI } from '../utils/versionts';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUserGuard } from '../authentication/auth-guards/authenticated-user.guard';
import { UserInfoResp } from './dto/user-info-resp';
import { PartnerDTO } from './dto/partner-dto';
import { PartnersListResponse } from './dto/partners-list-response';
import { RequestWithUserInfo } from './dto/RequestWithUserInfo';

@Controller(`${VERSION_1_URI}/users`)
@ApiTags('users')
export class UsersController {
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
    return request.userInformation;
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
    const userInfo = request.userInformation;

    return new PartnersListResponse(
      userInfo.partners?.map((partner) => new PartnerDTO(partner)) || [],
    );
  }
}
