import { NextFunction, Request, Response } from 'express';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import config from 'config';

import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import UserModel from './../user/models/userModel';

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // else if (req.cookies.jwt) {
    //   token = req.cookies.jwt;
    // }

    if (!token) {
      throw new AppError(
        'You are not logged in! Please login to get access.',
        401
      );
    }

    // Verify signToken
    const secret = config.get('jwt.secret') as string;
    const decoded: any = jwt.verify(token, secret);

    console.log(decoded);
    // const decoded: any = await promisify(jwt.verify)(token, secret);

    // Check if user still exits
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new AppError('The user that has this token no longer exist.', 401);
    }

    // Grant access to protected routes

    // Put user details in to the global request
    req.user = user;

    console.log(req.user);
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // roles ['admin', 'user']

    if (!roles.includes(req.user?.role as string)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    next();
  };
};
