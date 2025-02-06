import CategoryService from "@/services/admin/categoryService";
import { FC, useEffect, useState } from "react";
import { Category, columns } from "./columns";
import { DataTable } from "./components/data-table";

const CategoryManagement: FC = () => {
  const [data, setData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await CategoryService.getAllCategory();
        console.log(categories);
        setData(categories);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCategory();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CategoryManagement;
