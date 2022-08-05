import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
require('dotenv').config();

import { configuration } from '../config/default';
import logger from './logger';
import connect from './database/connection';
import userRouter from './routes/userRouter';
import teamRouter from './routes/teamRouter';
import fixtureRouter from './routes/fixtureRouter';
import { errorHandler } from './middlewares/errorHandler';
import AppError from './utils/appError';
require('./cache/cacheService');

const app: Application = express();

let RedisStore = connectRedis(session);
const redisClient = new Redis(configuration().redis.url);

// if running behind a proxy
// app.set('trust proxy', 1)

// Set Security Headers
app.use(helmet());

// Development logging
if (configuration().env === 'development') {
  app.use(morgan('dev'));
}

// Limt requests from same IP to 500 per hour
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(
  session({
    secret: configuration().cookie.secret,
    store: new RedisStore({ client: redisClient }),
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: configuration().env === 'production' ? true : 'auto',
      httpOnly: true,
      // expires:
      sameSite: configuration().env === 'production' ? 'none' : 'lax',
    },
  })
);

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['category'],
  })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/team', teamRouter);
app.use('/api/v1/fixture', fixtureRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('League API!');
});

const port = configuration().port;

app.listen(port, async () => {
  logger.info(`Server running on port ${port}!`);
  await connect();
});

app.all('*', (req, res, next) => {
  configuration().env;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

export default app;
