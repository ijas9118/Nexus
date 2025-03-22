import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./payment-management/columns";
import { DataTable } from "./payment-management/components/data-table";
import PaymentStats from "./payment-management/components/PaymentStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlanService from "@/services/planService";

const PaymentManagement: FC = () => {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });

  console.log(plans);

  if (isLoading) return <p>Loading contents...</p>;
  if (error) return <p>Error loading contents: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Payment Management</h1>
      <PaymentStats />
      <Tabs defaultValue="plans">
        <TabsList className="mb-4">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
          </div>

          <DataTable columns={columns()} data={plans || []} />
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add transaction table or list here */}
              <p>Transaction data to be implemented</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;
