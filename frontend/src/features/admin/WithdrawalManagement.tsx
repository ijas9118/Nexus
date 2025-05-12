import { WithdrawalRequestsFilters } from "./withdrawal-management/withdrawal-requests-filters";
import { WithdrawalRequestsStats } from "./withdrawal-management/withdrawal-requests-stats";
import { WithdrawalRequestsTable } from "./withdrawal-management/withdrawal-requests-table";

export default function WithdrawalRequestsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Withdrawal Requests</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-6 mx-4">
          <WithdrawalRequestsStats />
          <WithdrawalRequestsFilters />
          <WithdrawalRequestsTable />
        </main>
      </div>
    </div>
  );
}
