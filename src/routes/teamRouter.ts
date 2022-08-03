import express, { Router } from 'express';
import { protect, restrictTo } from '../middlewares';

import {
  createTeam,
  findTeamAllTeams,
  findTeamById,
  updateTeam,
} from '../team/controllers/teamController';

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route('/').post(createTeam).get(findTeamAllTeams);
router.route('/:id').get(findTeamById).patch(updateTeam);

export default router;
