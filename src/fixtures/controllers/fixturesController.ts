import { NextFunction, Request, Response } from 'express';
import { clone } from 'lodash';
import moment from 'moment';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { Fixture, FixtureStatues } from '../interfaces';
import {
  createFixture,
  find,
  findOne,
  remove,
  update,
} from '../services/fixturesService';

export const createFixtures = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { home, away }: Fixture = req.body;
      const user = clone(req.user);
      const payload = {
        home,
        away,
        createdBy: user?.id,
      } as Fixture;

      const data = await createFixture(payload);

      res.status(201).json({
        message: 'Fixtures created successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while creating fixtures: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const findFixtureById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const data = await findOne(id);

      res.status(200).json({
        message: 'Fixture fetched successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while fetching fixtures: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const findFixtures = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.query;

      const data = await find(status as FixtureStatues);

      res.status(200).json({
        message: 'Fixtures fetched successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while fetching fixtures: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const updateFixture = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const data = await update(id, status);

      res.status(200).json({
        message: 'Fixture updated successfully',
        status: 'success',
        data,
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while updating fixture: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);

export const removeFixture = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const payload: Partial<Fixture> = {
        isDeleted: true,
        deletedAt: moment().toDate(),
      };
      await remove(id, payload);

      res.status(204).json({
        message: 'Fixture removed successfully',
        status: 'success',
      });
    } catch (error: any) {
      logger.error(
        `Error occurred while removing fixture: ${JSON.stringify(error)}`
      );
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message,
      });
    }
  }
);
