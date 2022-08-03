import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  correctPassword(password: string, userPassword: string): Promise<boolean>;
}

export enum UserRoles {
  User = 'user',
  Admin = 'admin',
}
