import mongoose from 'mongoose';

import { configuration } from '../../config/default';
import logger from '../logger';

const connect = async () => {
  try {
    const dbUri = configuration().database.url;
    await mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => logger.info('Database connection successfull'));
  } catch (error) {
    logger.error('error connecting to database', error);
    process.exit(1);
  }
};

export default connect;
