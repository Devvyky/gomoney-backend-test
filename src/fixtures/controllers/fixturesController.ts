import { NextFunction, Request, Response } from 'express';
import { clone } from 'lodash';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { Team } from '../interfaces';
import { create, findOne, update } from '../services/fixturesService';

export const createTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, shortName, email }: Team = req.body;
      const user = clone(req.user);
      const payload = {
        name,
        shortName,
        email,
        createdBy: user?.id,
      } as Team;

      const data = await create(payload);

      res.status(201).json({
        message: 'Team created successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while creating team: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const findTeamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await findOne(id);

      res.status(200).json({
        message: 'Team fetched successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while fetching team: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const updateTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const payload = {
        ...req.body,
      } as Omit<Team, 'updatedAt'>;

      const data = await update(id, payload);

      res.status(200).json({
        message: 'Team Updated successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while fetching team: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);
