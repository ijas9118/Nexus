import express from 'express';
import { IWalletController } from '@/core/interfaces/controllers/IWalletController';
import { WithdrawalRequestController } from '@/controllers/withdrawalRequest.controller';
import { TYPES } from '@/di/types';
import { container } from '@/di/container';
import { authenticate } from '@/middlewares/auth.middleware';

const router = express.Router();
const walletController = container.get<IWalletController>(TYPES.WalletController);
const withdrawalRequestController = container.get<WithdrawalRequestController>(
  TYPES.WithdrawalRequestController
);

router.get('/', authenticate(['admin', 'mentor']), walletController.getWalletInfo);
router.post('/add', authenticate(['admin']), walletController.addMoney);
router.post(
  '/withdraw',
  authenticate(['admin', 'mentor', 'premium']),
  walletController.requestWithdrawal
);
router.post('/points', authenticate(['admin']), walletController.addNexusPoints);

router.get('/requests', authenticate(['admin']), withdrawalRequestController.getPendingRequests);

router.get(
  '/requests/user',
  authenticate(['admin', 'mentor', 'premium']),
  withdrawalRequestController.getUserPendingRequests
);

router.post(
  '/requests/approve',
  authenticate(['admin']),
  withdrawalRequestController.approveWithdrawal
);
router.post(
  '/requests/reject',
  authenticate(['admin']),
  withdrawalRequestController.rejectWithdrawal
);

export default router;
