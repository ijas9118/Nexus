import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { TransactionDetails } from "@/types/wallet";
import TransactionTable from "./TransactionTable";

interface TransactionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transactions: TransactionDetails[];
}

function TransactionTabs({
  activeTab,
  setActiveTab,
  transactions,
}: TransactionTabsProps) {
  const [period, setPeriod] = useState("30");

  // Note: Period filtering is not implemented in the backend query yet
  // This is a placeholder for future implementation
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    // Future: Add query refetch with period parameter
  };

  return (
    <Tabs
      defaultValue={activeTab}
      className="w-full"
      onValueChange={setActiveTab}
    >
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="withdrawal">Outgoing</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="all" className="mt-6">
        <TransactionTable transactions={transactions} />
      </TabsContent>
      <TabsContent value="incoming" className="mt-6">
        <TransactionTable transactions={transactions} />
      </TabsContent>
      <TabsContent value="withdrawal" className="mt-6">
        <TransactionTable transactions={transactions} />
      </TabsContent>
    </Tabs>
  );
}

export default TransactionTabs;
