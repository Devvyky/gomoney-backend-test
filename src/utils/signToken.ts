import jwt from 'jsonwebtoken';

import { configuration } from '../../config/default';

export const signToken = (id: string): string => {
  const secret = configuration().jwt.secret;
  const expiresIn = configuration().jwt.expiresIn;
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};
