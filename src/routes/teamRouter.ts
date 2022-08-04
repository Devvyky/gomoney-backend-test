import express, { Router } from 'express';
import { cleanCache, protect, restrictTo } from '../middlewares';

import {
  createTeam,
  findTeamAllTeams,
  findTeamById,
  updateTeam,
} from '../team/controllers/teamController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin'), cleanCache, createTeam)
  .get(restrictTo('admin', 'user'), findTeamAllTeams);
router
  .route('/:id')
  .get(restrictTo('admin', 'user'), findTeamById)
  .patch(restrictTo('admin'), updateTeam);

export default router;
