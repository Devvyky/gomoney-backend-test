import { Document } from 'mongoose';

export interface Fixture extends Document {
  home: {
    team: string;
    score?: number;
  };
  away: {
    team: string;
    score?: number;
  };
  link?: string;
  readonly createdBy: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export enum FixtureStatues {
  Completed = 'completed',
  Pending = 'pending',
  Ongoing = 'ongoing',
}
