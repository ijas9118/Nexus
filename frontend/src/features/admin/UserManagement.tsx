import { useEffect, useState } from "react";
import { AdminUser, columns } from "./userManagement/columns";
import AdminUserService from "@/services/admin/userManagement";
import { DataTable } from "./userManagement/components/data-table";

const UserManagement = () => {
  const [data, setData] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminUserService.getUsers(page, limit);
        setData(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [limit, page]);

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

      <DataTable
        columns={columns}
        data={data}
        pagination={{
          pageIndex: page - 1,
          pageSize: limit,
          pageCount: Math.ceil(total / limit),
          onPageChange: (newPageIndex) => handlePageChange(newPageIndex + 1),
          onPageSizeChange: handleLimitChange,
        }}
      />
    </div>
  );
};

export default UserManagement;
