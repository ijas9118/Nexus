import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { ContentService } from "@/services/admin/contentService";
import { DataTable } from "./content-management/components/data-table";
import { columns } from "./content-management/columns";
import { useNavigate } from "react-router-dom";

const ContentManagement: FC = () => {
  const navigator = useNavigate();
  const {
    data: contents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contents"],
    queryFn: ContentService.getAllContents,
  });

  const handleRowClick = (content: any) => {
    navigator(`/admin/contents/${content._id}`);
  };

  if (isLoading) return <p>Loading contents...</p>;
  if (error) return <p>Error loading contents: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Content Management</h1>

      <DataTable
        columns={columns()}
        data={contents || []}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ContentManagement;
