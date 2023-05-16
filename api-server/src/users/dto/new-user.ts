import { UserInformation } from '../../authentication/parse-jwt';

export default interface NewUser {
  name: string;
  nickname: string;
  picture?: string;
  identifier?: string;
  settings?: Record<string, unknown>;
  permissions_post_as_venues?: Record<string, unknown>;
  permissions_edit_lists?: Record<string, unknown>;
}

export function buildFromUserInfo(userInfo: UserInformation): NewUser {
  const decodedTokenInfo = userInfo.decodedToken;

  return {
    name: decodedTokenInfo.name,
    nickname: decodedTokenInfo.nickname,
    picture: decodedTokenInfo.picture,
    permissions_edit_lists: {},
    permissions_post_as_venues: {},
  };
}
