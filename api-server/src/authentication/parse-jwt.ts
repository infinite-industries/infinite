import jwt = require('jsonwebtoken');
import { Request } from 'express';
import { SECRET } from '../constants';

export interface UserInformation {
  token: string;
  decodedToken: DecodedAuthZeroToken;
  isInfiniteAdmin: boolean;
  venueIds: string[];
}

export interface DecodedAuthZeroToken extends Record<string, unknown> {
  name?: string;
  'https://infinite.industries.com/isInfiniteAdmin'?: boolean;
  'https://infinite.industries.com/venueIDs'?: string[];
  nickname?: string;
  picture?: string;
  iss?: string;
  sub?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  at_hash?: string;
  nonce?: string;
}

export function parseJwt(req: Request): Promise<UserInformation> {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  return getUserInformationFromToken(token);
}

function getUserInformationFromToken(token: string): Promise<UserInformation> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decodedToken: DecodedAuthZeroToken) => {
      if (err) {
        reject(`error decoding request token: ${err}`);
      } else {
        const isInfiniteAdmin =
          !!decodedToken['https://infinite.industries.com/isInfiniteAdmin'];
        const venueIds =
          decodedToken['https://infinite.industries.com/venueIDs'];

        resolve({
          token,
          decodedToken,
          isInfiniteAdmin,
          venueIds,
        });
      }
    });
  });
}
