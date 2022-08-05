import express, { Router } from 'express';
import {
  createFixtures,
  findFixtureById,
  findFixtures,
  removeFixture,
  updateFixture,
} from '../fixtures/controllers/fixturesController';
import { protect, restrictTo } from '../middlewares';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin'), createFixtures)
  .get(restrictTo('admin', 'user'), findFixtures);
router
  .route('/:id')
  .get(restrictTo('admin', 'user'), findFixtureById)
  .patch(restrictTo('admin'), updateFixture)
  .delete(restrictTo('admin'), removeFixture);

export default router;
