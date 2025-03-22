import CategoryService from "@/services/admin/categoryService";
import { FC, useEffect, useState } from "react";
import { columns } from "./category-management/columns";
import { DataTable } from "./category-management/components/data-table";
import { Category } from "@/types/category";

const CategoryManagement: FC = () => {
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await CategoryService.getAllCategory();
        setData(categories);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCategory();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Category Management</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CategoryManagement;
