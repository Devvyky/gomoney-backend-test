// @ts-nocheck

import Redis from 'ioredis';
import mongoose from 'mongoose';
import { promisify } from 'util';

import logger from '../logger';
import { configuration } from '../../config/default';

const client = new Redis(configuration().redis.url);
client.hget = promisify(client.hget) as any;

const exec = mongoose.Query.prototype.exec;

/*
 Custom cache method  attached on moongoose Query Hooks
 to cache the results of a query when called
*/

mongoose.Query.prototype.cache = function (options: any = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
};

mongoose.Query.prototype.exec = async function () {
  logger.info('Serving data from cache');

  if (!this.useCache) {
    return exec.apply(this, arguments as any);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.model.collection.name,
    })
  );

  // Check if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);

  // // If we do, serve data from cache instead of running the query
  if (cacheValue) {
    logger.info('Serving from cache');
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // If we don't, run the query and store the result in redis
  const result = await exec.apply(this, arguments as any);

  client.hset(this.hashKey, key, JSON.stringify(result));

  return result;
};

export const clearCache = () => {
  logger.info('Clearing cache');
  return client.flushall();
};
