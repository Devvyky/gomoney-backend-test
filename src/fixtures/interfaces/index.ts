import { Document } from 'mongoose';

export interface Fixture extends Document {
  name: string;
  shortName: string;
  email: string;
  readonly createdBy: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export enum FixtureStatues {
  Completed = 'Completed',
  Pending = 'Pending',
  Ongoing = 'Ongoing',
}
