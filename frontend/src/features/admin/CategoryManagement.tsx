import type React from "react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useCategoryManagement } from "./category-management/hooks/use-category-management";
import CategoryTable from "./category-management/components/category-table";
import CategoryPagination from "./category-management/components/category-pagination";
import AddCategoryDialog from "./category-management/components/add-category-dialog";
import EditCategoryDialog from "./category-management/components/edit-category-dialog";

export default function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    categories,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
    handleAddCategory,
    handleUpdateCategory,
    handleToggleStatus,
  } = useCategoryManagement();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  if (error) {
    toast.error("Error", {
      description: "Failed to load categories. Please try again.",
    });
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Category Management
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={setEditCategory}
            onToggleStatus={handleToggleStatus}
          />

          {pagination && (
            <CategoryPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <AddCategoryDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddCategory}
      />

      {editCategory && (
        <EditCategoryDialog
          category={editCategory}
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          onUpdate={handleUpdateCategory}
        />
      )}
    </div>
  );
}
