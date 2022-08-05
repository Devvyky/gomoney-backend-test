import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { configuration } from '../../config/default';
import logger from '../logger';

// handle cast errors from mongoose
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// handle duplicate key errors from mongoose
const handleDuplicateFieldDB = (err: any) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value} . Pls use another value`;
  return new AppError(message, 409);
};

// handle validaion errors
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle invalid JWT token errors
const handleJWTError = () =>
  new AppError('Invalid token, pls login again!', 401);

// Handle JWT expired errors
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Pls login again', 401);

// Structure Error format in Development
const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Structure Error format in Production
const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unhandled,Programming, or unknown error: don't leak error details to user
    // Log Error
    logger.error('Error 💥:', err);

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// Global error handler
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (configuration().env === 'development') {
    // Send development error
    sendErrorDev(err, res);
  } else if (configuration().env === 'staging') {
    // Send production error
    let error = { ...err };
    error.message = err.message;

    console.log({ error });

    if (error.message.includes('Cast to ObjectId')) {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
