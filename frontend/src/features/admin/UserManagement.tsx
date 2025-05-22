import { useState } from "react";
import { getUserTableColumns } from "./userManagement/columns";
import AdminUserService from "@/services/admin/userManagement";
import { DataTable } from "./userManagement/components/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users", page, limit],
    queryFn: () => AdminUserService.getUsers(page, limit),
  });

  const blockMutation = useMutation({
    mutationFn: (userId: string) => AdminUserService.blockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => AdminUserService.unblockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const columns = getUserTableColumns(blockMutation, unblockMutation);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">User Management</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pagination={{
            pageIndex: page - 1,
            pageSize: limit,
            pageCount: data ? data.totalPages : 0,
            onPageChange: (newPageIndex) => handlePageChange(newPageIndex + 1),
            onPageSizeChange: handleLimitChange,
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
