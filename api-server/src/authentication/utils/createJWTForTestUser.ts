import jwt from 'jsonwebtoken';
import { SECRET } from '../../constants';

export default function createJWTForTestUser(props: {
  nickname: string;
  name: string;
  picture: string;
  sub: string;
  'https://infinite.industries.com/isInfiniteAdmin': boolean;
}) {
  const userValues = {
    ...props,
  };

  return jwt.sign(userValues, SECRET);
}
