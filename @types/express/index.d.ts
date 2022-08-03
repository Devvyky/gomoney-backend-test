import { Express } from 'express';

import { User } from '../../src/user/interfaces';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
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
