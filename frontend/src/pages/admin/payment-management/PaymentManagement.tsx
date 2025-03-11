import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { DataTable } from "./components/data-table";
import { ContentService } from "@/services/admin/contentService";
import PaymentStats from "./components/PaymentStats";

const PaymentManagement: FC = () => {
  const {
    data: contents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contents"],
    queryFn: ContentService.getAllContents,
  });

  if (isLoading) return <p>Loading contents...</p>;
  if (error) return <p>Error loading contents: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <PaymentStats />
      <DataTable columns={columns()} data={contents || []} />
    </div>
  );
};

export default PaymentManagement;
