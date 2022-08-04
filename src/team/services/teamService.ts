import { NextFunction, Request, Response } from 'express';

import logger from '../../logger';
import AppError from '../../utils/appError';
import { Team, TeamStatues } from '../interfaces';
import TeamModel from '../models/teamModel';

export const create = async (payload: Team): Promise<Team> => {
  logger.info(`Creating team with payload', ${JSON.stringify(payload)}`);

  return TeamModel.create(payload);
};

export const find = async (): Promise<Team[]> => {
  // @ts-ignore
  return TeamModel.find({ status: TeamStatues.Active }).cache();
};

export const findOne = async (id: string): Promise<Team> => {
  logger.info(`finding team with ID ${id}`);

  const team = (await TeamModel.findById(id).populate({
    path: 'createdBy',
    select: 'name role',
  })) as Team;

  if (!team) {
    throw new AppError('No team found with that ID', 400);
  }

  return team;
};

export const update = async (id: string, payload: Team): Promise<Team> => {
  logger.info(
    `attempting to update team with ID: ${id} with paylod: ${JSON.stringify(
      payload
    )}`
  );

  const team = (await TeamModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })) as Team;

  if (!team) {
    throw new AppError('No team found with that ID', 400);
  }

  return team;
};
