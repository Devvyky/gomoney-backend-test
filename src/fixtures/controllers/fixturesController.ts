import { NextFunction, Request, Response } from 'express';
import { clone } from 'lodash';

import logger from '../../logger';
import catchAsync from '../../utils/catchAsync';
import { signToken } from '../../utils/signToken';
import { Fixture } from '../interfaces';
import { createFixture, findOne } from '../services/fixturesService';

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

// export const updateTeam = catchAsync(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const { id } = req.params;

//       const payload = {
//         ...req.body,
//       } as Omit<Team, 'updatedAt'>;

//       const data = await update(id, payload);

//       res.status(200).json({
//         message: 'Team Updated successfully',
//         status: 'success',
//         data,
//       });
//     } catch (error: any) {
//       logger.error(
//         `Error occurred while fetching team: ${JSON.stringify(error)}`
//       );
//       res.status(error.statusCode || 500).json({
//         status: error.status || 'error',
//         message: error.message,
//       });
//     }
//   }
// );
