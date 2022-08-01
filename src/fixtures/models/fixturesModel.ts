import mongoose, { Schema, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';

import { Fixture, FixtureStatues } from '../interfaces';
import moment from 'moment';

const fixtureSchema = new Schema(
  {
    home: {
      team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    away: {
      team: {                                                                    
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: {
        values: FixtureStatues,
        message: 'Team status is either completed, pending or ongoing',
      },
      default: FixtureStatues.Pending,
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

fixtureSchema.pre('save', function (next: HookNextFunction) {
  const fixture = this as Fixture;

  if (fixture.isNew) return next();

  fixture.updatedAt = moment().toDate();

  next();
});

const Team = mongoose.model<Fixture>('Fixture', fixtureSchema);

export default Team;
