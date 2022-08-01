import mongoose, { Schema, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';

import { Team, TeamStatues } from '../interfaces';
import moment from 'moment';

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: TeamStatues,
      default: TeamStatues.Active,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.pre('save', function (next: HookNextFunction) {
  const team = this as Team;

  if (team.isNew) return next();

  team.updatedAt = moment().toDate();

  next();
});

const Team = mongoose.model<Team>('Team', teamSchema);

export default Team;
