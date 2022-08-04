import express, { Router } from 'express';
import {
  createFixtures,
  findFixtureById,
} from '../fixtures/controllers/fixturesController';
import { protect, restrictTo } from '../middlewares';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin'), createFixtures)
  .get(restrictTo('admin', 'user'), findFixtureById);
// .get(findTeamAllTeams);
// router.route('/:id').get(findTeamById).patch(updateTeam);

export default router;
