import { Document } from 'mongoose';

export interface Team extends Document {
  name: string;
  shortName: string;
  email: string;
  status: TeamStatues;
  isDeleted: boolean;
  readonly createdBy: string;
  readonly createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export enum TeamStatues {
  Active = 'active',
  Inactive = 'in-active',
}
