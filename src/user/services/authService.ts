import { omit } from 'lodash';
import logger from '../../logger';
import AppError from '../../utils/appError';
import { User } from '../interfaces';
import UserModel from '../models/userModel';

export const signup = async (
  payload: User,
  isAdmin?: boolean
): Promise<User> => {
  logger.info(`User signup with email: ${JSON.stringify(payload.email)}`);
  const role = isAdmin ? 'admin' : 'user';

  if (role) {
    payload.role = role;
  }

  const user = await UserModel.create(payload);

  return user;
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  logger.info(`User login with email: ${JSON.stringify(payload.email)}`);

  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }

  // Check if user exists && password is correct
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};
