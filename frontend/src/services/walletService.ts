import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { IWallet } from "@/types/wallet";

const WalletService = {
  getWalletInfo: () => handleApi(() => api.get<IWallet>("/wallet")),

  addMoney: (amount: number) =>
    handleApi(() => api.post<IWallet>("/wallet/add", { amount })),

  requestWithdrawal: (
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number,
  ) =>
    handleApi(() =>
      api.post("/wallet/withdraw", {
        amount,
        withdrawalNote,
        nexusPoints: nexusPoints || 0,
      }),
    ),

  addNexusPoints: (points: number) =>
    handleApi(() => api.post<IWallet>("/wallet/points", { points })),

  getPendingRequests: () => handleApi(() => api.get<any[]>("/wallet/requests")),

  getUserPendingRequests: () =>
    handleApi(() => api.get("/wallet/requests/user")),

  approveWithdrawal: (requestId: string) =>
    handleApi(() => api.post(`/wallet/requests/approve`, { requestId })),

  rejectWithdrawal: (requestId: string) =>
    handleApi(() => api.post(`/wallet/requests/reject`, { requestId })),
};

export default WalletService;
