import logger from '../../logger';
import AppError from '../../utils/appError';
import { User } from '../interfaces';
import UserModel from '../models/userModel';

export const signup = async (
  payload: User,
  isAdmin?: boolean
): Promise<void> => {
  try {
    logger.info(`User signup with payload', ${JSON.stringify(payload)}`);
    const role = isAdmin ? 'admin' : 'user';

    if (role) {
      payload.role = role;
    }

    await UserModel.create(payload);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
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
