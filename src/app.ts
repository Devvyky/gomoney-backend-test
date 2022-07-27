import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import config from 'config';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
require('dotenv').config();

import logger from './logger';
import connect from './database/connection';

const app: Application = express();

// Set Security Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['category'],
  })
);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

const port = config.get('port') as number;

app.listen(port, () => {
  logger.info(`Server running on port ${port}!`);
  connect();
});

module.exports = app;
