import express from 'express';
import { IWalletController } from '@/core/interfaces/controllers/IWalletController';
import { TYPES } from '@/di/types';
import { container } from '@/di/container';

const router = express.Router();
const walletController = container.get<IWalletController>(TYPES.WalletController);

router.post('/add', walletController.addMoney);
router.post('/withdraw', walletController.withdrawMoney);
router.get('/:userId', walletController.getWalletInfo);

export default router;
