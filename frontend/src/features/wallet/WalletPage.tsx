import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { IWallet } from "@/types/wallet";
import WalletService from "@/services/walletService";
import WithdrawalDialog from "./components/WithdrawalDialog";
import WalletBalanceCard from "./components/WalletBalanceCard";
import WalletSummaryCard from "./components/WalletSummaryCard";
import TransactionTabs from "./components/TransactionTabs";
import PendingRequestsTable from "./components/PendingRequestsTable";

// Create QueryClient
const queryClient = new QueryClient();

function WalletPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletPage />
    </QueryClientProvider>
  );
}

function WalletPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Fetch wallet data using React Query
  const {
    data: wallet,
    isLoading,
    error,
  } = useQuery<IWallet>({
    queryKey: ["wallet"],
    queryFn: WalletService.getWalletInfo,
  });

  // Fetch pending withdrawal requests for the current user
  const { data: pendingRequests = [] } = useQuery<any>({
    queryKey: ["pendingRequests"],
    queryFn: WalletService.getUserPendingRequests,
  });

  // Filter transactions based on active tab
  const filteredTransactions =
    wallet?.transactions.filter((transaction) => {
      if (activeTab === "all") return true;
      return transaction.type === activeTab;
    }) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading wallet data</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mentor Wallet</h1>
        <WithdrawalDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WalletBalanceCard balance={wallet?.balance || 0} />
        <WalletSummaryCard
          transactions={wallet?.transactions || []}
          type="incoming"
        />
        <WalletSummaryCard
          transactions={wallet?.transactions || []}
          type="withdrawal"
        />
      </div>

      {pendingRequests && pendingRequests.length > 0 && (
        <PendingRequestsTable requests={pendingRequests} />
      )}

      <TransactionTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        transactions={filteredTransactions}
      />
    </div>
  );
}

export default WalletPageWrapper;
