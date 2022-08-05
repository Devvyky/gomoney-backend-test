import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { configuration } from '../../config/default';
import { clearCache } from '../cache/cacheService';
import logger from '../logger';
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

    if (!token) {
      throw new AppError(
        'You are not logged in! Please login to get access.',
        401
      );
    }

    // Verify signToken
    const secret = configuration().jwt.secret;
    const decoded: any = jwt.verify(token, secret);

    // Check if user still exits
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new AppError('The user that has this token no longer exist.', 401);
    }

    // Grant access to protected routes
    // Put user details in to the global request object
    req.user = user;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // try {
    // roles ['admin', 'user']

    if (!roles.includes(req.user.role as string)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    // Access granted
    next();
    // } catch (error: any) {
    //   logger.error(`Forbidden acess: ${JSON.stringify(error)}`);
    //   res.status(error.statusCode || 500).json({
    //     status: error.status || 'error',
    //     message: error.message,
    //   });
    // }
  };
};

export const cleanCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
  clearCache();
};
