import { useEffect, useState } from "react";
import { AdminUser, columns } from "./columns";
import AdminUserService from "@/services/admin/userManagement";
import { DataTable } from "./components/data-table";

const UserManagement = () => {
  const [data, setData] = useState<AdminUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await AdminUserService.getUsers();
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">User Management</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UserManagement;
