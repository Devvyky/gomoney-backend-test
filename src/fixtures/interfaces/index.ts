import { Document } from 'mongoose';

export interface Fixture extends Document {
  home: string;
  away: number;
  link?: string;
  isDeleted?: false;
  readonly createdBy: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export enum FixtureStatues {
  Completed = 'completed',
  Pending = 'pending',
  Ongoing = 'ongoing',
}
