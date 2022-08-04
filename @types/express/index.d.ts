import { Express } from 'express';
import session from 'express-session';

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

// export interface CustomRequest extends Request {
//   user?: User;
// }

// import { User } from '../src/user/interfaces';

// declare module 'express' {
//   export interface Request {
//     user?: User;
//   }
// }
