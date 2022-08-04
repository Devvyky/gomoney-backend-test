import mongoose, { Schema, HookNextFunction } from 'mongoose';
import { randomBytes } from 'crypto';

import { Fixture, FixtureStatues } from '../interfaces';
import moment from 'moment';
import { configuration } from '../../../config/default';

const fixtureSchema = new Schema(
  {
    home: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },

    away: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
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

  const url = configuration().baseUrl;

  fixture.link = `${url}/${randomBytes(16).toString('hex')}`;

  next();
});

const Team = mongoose.model<Fixture>('Fixture', fixtureSchema);

export default Team;
