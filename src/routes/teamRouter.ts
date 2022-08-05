import express, { Router } from 'express';
import { cleanCache, protect, restrictTo } from '../middlewares';

import {
  createTeam,
  findAllTeams,
  findTeamById,
  removeTeam,
  updateTeam,
} from '../team/controllers/teamController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin'), cleanCache, createTeam)
  .get(restrictTo('admin', 'user'), findAllTeams);
router
  .route('/:id')
  .get(restrictTo('admin', 'user'), findTeamById)
  .patch(restrictTo('admin'), cleanCache, updateTeam)
  .delete(restrictTo('admin'), cleanCache, removeTeam);

export default router;
