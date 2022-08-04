import { Express } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import { User, UserSession } from '../../src/user/interfaces';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    user: UserSession;
  }
}

declare module 'mongoose' {
  interface DocumentQuery<
    T,
    DocType extends import('mongoose').Document,
    QueryHelpers = {}
  > {
    mongooseCollection: {
      name: any;
    };
    cache(): DocumentQuery<T[], Document> & QueryHelpers;
    useCache: boolean;
    hashKey: string;
  }
}

// export interface CustomRequest extends Request {
//   user?: User;
// }

// import { User } from '../src/user/interfaces';

// declare module 'express' {
//   export interface Request {
//     user?: User;
//   }
// }
