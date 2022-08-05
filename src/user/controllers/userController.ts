import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { searchTeam } from '../services/userService';

export const searchTeams = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search } = req.query;

    const data = await searchTeam(search as string);

    res.status(200).json({
      message: 'Teams or fixtures fetched successfully',
      status: 'success',
      data,
    });
  }
);
