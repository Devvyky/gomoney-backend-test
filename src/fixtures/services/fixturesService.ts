import { NextFunction, Request, Response } from 'express';
import { FilterQuery } from 'mongoose';

import logger from '../../logger';
import AppError from '../../utils/appError';
import { Fixture, FixtureStatues } from '../interfaces';
import FixtureModel from '../models/fixturesModel';

export const createFixture = async (payload: Fixture): Promise<Fixture> => {
  logger.info(`Creating fixture with payload', ${JSON.stringify(payload)}`);

  return FixtureModel.create(payload);
};

export const findOne = async (id: string): Promise<Fixture> => {
  logger.info(`finding fixture with ID ${id}`);

  const fixture = await FixtureModel.findById(id)
    .populate({
      path: 'createdBy',
      select: 'name role',
    })
    .populate({
      path: 'home',
      select: 'name shortName',
    })
    .populate({
      path: 'away',
      select: 'name shortName',
    });

  if (!fixture) {
    throw new AppError('No fixture found with that ID', 400);
  }

  return fixture;
};

export const update = async (id: string, status: string): Promise<Fixture> => {
  logger.info(
    `attempting to update team with ID: ${id} with status: ${status}`
  );

  const fixture = (await FixtureModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status },
    {
      new: true,
    }
  )) as Fixture;

  if (!fixture) {
    throw new AppError('No fixture found with that ID', 400);
  }

  return fixture;
};

export const find = async (status: FixtureStatues): Promise<Fixture[]> => {
  logger.info(`finding fixtures`);

  const criteria: FilterQuery<Fixture> = {
    isDeleted: false,
  };

  if (status) {
    criteria.status = status;
  }

  const fixture = await FixtureModel.find(criteria)
    .populate({
      path: 'createdBy',
      select: 'name role',
    })
    .populate({
      path: 'home',
      select: 'name shortName',
    })
    .populate({
      path: 'away',
      select: 'name shortName',
    });

  if (!fixture) {
    throw new AppError('No fixture found with that ID', 400);
  }

  return fixture;
};

export const remove = async (
  id: string,
  payload: Partial<Fixture>
): Promise<void> => {
  logger.info(
    `attempting to remove fixture with ID: ${id} with paylod: ${JSON.stringify(
      payload
    )}`
  );

  const team = await FixtureModel.findOne({ id, isDeleted: false });

  if (!team) {
    throw new AppError('No fixture found with that ID or already deleted', 404);
  }

  await FixtureModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};
