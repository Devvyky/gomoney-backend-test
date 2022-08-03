import { Document } from 'mongoose';

export interface Team extends Document {
  name: string;
  shortName: string;
  email: string;
  readonly createdBy: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export enum TeamStatues {
  Active = 'active',
  Inactive = 'in-active',
}
