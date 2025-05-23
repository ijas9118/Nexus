import { type FC, useState } from "react";
import { getColumns } from "./category-management/columns";
import { DataTable } from "./category-management/components/data-table";
import type { Category } from "@/types/category";
import {
  useCategories,
  useToggleCategoryStatus,
} from "./category-management/hooks/use-categories";
import EditCategoryModal from "./category-management/components/edit-category-modal";

const CategoryManagement: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use React Query hooks
  const { data: categories = [], isLoading } = useCategories();
  const toggleStatusMutation = useToggleCategoryStatus();

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const columns = getColumns({
    onEdit: handleEditCategory,
    onToggleStatus: handleToggleStatus,
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <h1 className="text-3xl font-semibold mb-6">Category Management</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading categories...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={categories} />
      )}

      <EditCategoryModal
        category={selectedCategory}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default CategoryManagement;
