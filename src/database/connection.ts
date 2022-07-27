import mongoose from 'mongoose';
import config from 'config';

import logger from '../logger';

const connect = async () => {
  try {
    const dbUri = config.get('database.url') as string;
    await mongoose
      .connect(dbUri)
      .then(() => logger.info('Database connection successfull'));
  } catch (error) {
    logger.error('error connecting to database', error);
    process.exit(1);
  }
};

export default connect;
