import { NextFunction, Request, Response } from 'express';
import { clone } from 'lodash';
import moment from 'moment';

import catchAsync from '../../utils/catchAsync';
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
    const { home, away }: Fixture = req.body;
    const user = clone(req.user);
    const payload = {
      home,
      away,
      createdBy: user.id,
    } as Fixture;

    const data = await createFixture(payload);

    res.status(201).json({
      message: 'Fixtures created successfully',
      status: 'success',
      data,
    });
  }
);

export const findFixtureById = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const data = await findOne(id);

    res.status(200).json({
      message: 'Fixture fetched successfully',
      status: 'success',
      data,
    });
  }
);

export const findFixtures = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status } = req.query;

    const data = await find(status as FixtureStatues);

    res.status(200).json({
      message: 'Fixtures fetched successfully',
      status: 'success',
      data,
    });
  }
);

export const updateFixture = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    const data = await update(id, status);

    res.status(200).json({
      message: 'Fixture updated successfully',
      status: 'success',
      data,
    });
  }
);

export const removeFixture = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  }
);
