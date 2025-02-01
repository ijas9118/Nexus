import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/table/data-table";
import { columns } from "./columns";
import AdminUserService from "@/services/admin/userManagement";

const UserManagement = () => {
  interface AdminUser {
    id: string;
    name: string;
    email: string;
    profilePic: string ;
    postsCount: number;
    joinedSquadsCount: number;
  }

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
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UserManagement;
