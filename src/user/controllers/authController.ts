import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { User } from '../interfaces';
import { login, signup } from '../services/authService';

export const userSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password }: User = req.body;
    const { admin } = req.query;

    const isAdmin = (admin as string).toLowerCase() === 'false' ? false : true;

    const payload = {
      name,
      email,
      password,
    } as User;

    await signup(payload, isAdmin);

    res.status(201).json({
      message: isAdmin ? 'Admin signup successful' : 'User signup successful',
      status: 'success',
    });
  }
);

export const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password }: User = req.body;

    const payload = {
      email,
      password,
    } as User;

    const user = await login(payload);

    req.session.user = {
      user: user.id,
      valid: true,
      userAgent: req.get('User-Agent') as string,
    };

    const token = signToken(user._id);

    res.status(200).json({
      message: 'User login successful',
      status: 'success',
      token,
      data: user,
    });
  }
);
