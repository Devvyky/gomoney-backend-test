import { NextFunction, Request, Response } from 'express';
import { clone } from 'lodash';
import moment from 'moment';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { Team, TeamStatues } from '../interfaces';
import { create, find, findOne, remove, update } from '../services/teamService';

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

export const findTeamAllTeams = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await find();

      res.status(200).json({
        message: 'Teams fetched successfully',
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
      const { name, shortName, email }: Team = req.body;
      const payload: Partial<Team> = {
        name,
        shortName,
        email,
      };

      console.log(payload);

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

export const removeTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const payload: Partial<Team> = {
        isDeleted: true,
        status: TeamStatues.Inactive,
        deletedAt: moment().toDate(),
      };

      await remove(id, payload);

      res.status(204).json({
        message: 'Team Removed successfully',
        status: 'success',
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while removing team: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);
