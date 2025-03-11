import { Router } from 'express';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { PlanController } from '../controllers/plan.controller';
import { createPlanSchema } from '../validations/plan.schema';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const planController = container.get<PlanController>(TYPES.PlanController);

const router = Router();

router.get('/', authenticate(['admin', 'user']), planController.getPlans);
router.post('/', authenticate(['admin']), validate(createPlanSchema), planController.createPlan);

export default router;
