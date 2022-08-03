import mongoose, { Schema, HookNextFunction } from 'mongoose';
import { randomBytes } from 'crypto';
import config from 'config';

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
      enum: FixtureStatues,
      default: FixtureStatues.Pending,
    },
    link: {
      type: String,
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

fixtureSchema.pre('save', async function (next: HookNextFunction) {
  const fixture = this as Fixture;

  if (!fixture.isNew) return next();

  const url = config.get('baseUrl') as string;

  fixture.link = `${url}/${randomBytes(16).toString('hex')}`;

  next();
});

const Team = mongoose.model<Fixture>('Fixture', fixtureSchema);

export default Team;
