import jwt from 'jsonwebtoken';
import config from 'config';

export const signToken = (id: string): string => {
  const secret = config.get('jwt.secret') as string;
  const expiresIn = config.get('jwt.expiresIn') as string;
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};
