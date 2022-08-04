import express from 'express';

import { userLogin, userSignup } from '../user/controllers/authController';
import { searchTeams } from '../user/controllers/userController';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);

router.get('/', searchTeams);

export default router;
