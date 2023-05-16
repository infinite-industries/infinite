import * as jwt from 'jsonwebtoken';
import * as faker from 'faker';
import { promises as fs } from 'fs';

const SECRET_PATH = `${__dirname}/../../test-keys/1nfinite_testing_rsa256.rsa`;

export default async function createJwtForRandomUser(
  overrides: Partial<JwtUser> = {},
): Promise<string> {
  const privateKey = await fs.readFile(SECRET_PATH);

  const userValues = {
    'https://infinite.industries.com/isInfiniteAdmin': true,
    nickname: faker.internet.userName(),
    name: faker.name.lastName(),
    picture: faker.internet.url(),
    sub: faker.internet.userName(),
    ...overrides,
  };

  return jwt.sign(userValues, privateKey);
}

export interface JwtUser {
  'https://infinite.industries.com/isInfiniteAdmin': boolean;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  at_hash: number;
  nounce: string;
}
