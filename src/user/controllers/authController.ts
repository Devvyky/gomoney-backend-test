import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import { omit } from 'lodash';
// import { omit } from 'lodash';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { User } from '../interfaces';
import { login, signup } from '../services/authService';

export const userSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password }: User = req.body;
      const isAdmin: boolean = _.isBoolean(req.query.admin);
      const payload = {
        name,
        email,
        password,
      } as User;

      await signup(payload, isAdmin);

      res.status(201).json({
        message: 'User signup successful',
        status: 'success',
      });
    } catch (error: any) {
      logger.error(`Error in signup: ${JSON.stringify(error)}`);
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password }: User = req.body;

      const payload = {
        email,
        password,
      } as User;

      const user = await login(payload);

      const data = {
        ...omit(user, 'passsword'),
      };

      console.log(data);

      // req.session.user = {
      //   user: user.id,
      //   valid: true,
      //   userAgent: req.get('User-Agent') as string,
      // };

      const token = signToken(user?._id);

      res.status(200).json({
        message: 'User login successful',
        status: 'success',
        token,
        data,
      });
    } catch (error: any) {
      logger.error(`Error logging: ${error}`);
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);
