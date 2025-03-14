import { Router } from 'express';
import { container } from '../di/container';
import { PaymentController } from '../controllers/payment.controller';
import { TYPES } from '../di/types';

const router = Router();

const paymentController = container.get<PaymentController>(TYPES.PaymentController);

router.post('/create-checkout-session', paymentController.checkoutSession);

export default router;
