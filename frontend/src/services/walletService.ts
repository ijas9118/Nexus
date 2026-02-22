import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { IWallet } from "@/types/wallet";
import { WALLET_ROUTES } from "@/utils/constants";

const WalletService = {
  getWalletInfo: () => handleApi(() => api.get<IWallet>(WALLET_ROUTES.BASE)),

  addMoney: (amount: number) =>
    handleApi(() => api.post<IWallet>(WALLET_ROUTES.ADD, { amount })),

  requestWithdrawal: (
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number,
  ) =>
    handleApi(() =>
      api.post(WALLET_ROUTES.WITHDRAW, {
        amount,
        withdrawalNote,
        nexusPoints: nexusPoints || 0,
      }),
    ),

  addNexusPoints: (points: number) =>
    handleApi(() => api.post<IWallet>(WALLET_ROUTES.POINTS, { points })),

  getPendingRequests: () =>
    handleApi(() => api.get<any[]>(WALLET_ROUTES.REQUESTS)),

  getUserPendingRequests: () =>
    handleApi(() => api.get(WALLET_ROUTES.REQUESTS_USER)),

  approveWithdrawal: (requestId: string) =>
    handleApi(() => api.post(WALLET_ROUTES.REQUESTS_APPROVE, { requestId })),

  rejectWithdrawal: (requestId: string) =>
    handleApi(() => api.post(WALLET_ROUTES.REQUESTS_REJECT, { requestId })),
};

export default WalletService;
