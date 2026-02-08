import { Router } from 'express';

import type { PlanController } from '../controllers/plan.controller';

import { container } from '../di/container';
import { TYPES } from '../di/types';
import { authenticate } from '../middlewares/auth.middleware';

const planController = container.get<PlanController>(TYPES.PlanController);

const router = Router();

// Get all plans
router.get('/', planController.getAllPlans);

// Get a single plan by ID
router.get(
  '/:id',
  authenticate(['admin', 'user', 'premium', 'mentor']),
  planController.getPlanById
);

// Create a new plan
router.post('/', authenticate(['admin']), planController.createPlan);

// Update a plan by ID
router.put('/:id', authenticate(['admin']), planController.updatePlan);

// Delete (soft delete) a plan by ID
router.delete('/:id', authenticate(['admin']), planController.deletePlan);

export default router;
