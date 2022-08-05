import { Document } from 'mongoose';

export interface Fixture extends Document {
  home: string;
  away: number;
  link?: string;
  isDeleted?: boolean;
  readonly createdBy: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum FixtureStatues {
  Completed = 'completed',
  Pending = 'pending',
  Ongoing = 'ongoing',
}
