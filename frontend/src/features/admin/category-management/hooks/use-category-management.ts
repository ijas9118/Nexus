import { useState, useEffect, useCallback } from "react";
import type { Category } from "@/types/category";
import CategoryService from "@/services/admin/categoryService";
import { toast } from "sonner";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(3);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CategoryService.getAllCategoriesWithPagination(
        currentPage,
        limit,
        searchTerm,
      );

      setCategories(response.categories || response);

      if (response.categories) {
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error("Failed to fetch categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddCategory = async (name: string) => {
    try {
      await CategoryService.createCategory(name);
      toast.success("Success", {
        description: "Category added successfully",
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("Error", {
        description: "Failed to add category",
      });
      throw err;
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    try {
      await CategoryService.updateCategory(id, newName);
      toast.success("Success", {
        description: "Category updated successfully",
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to update category:", err);
      toast.error("Error", {
        description: "Failed to update category",
      });
      throw err;
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await CategoryService.toggleStatus(id);
      toast.success("Success", {
        description: "Category status updated successfully",
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to toggle category status:", err);
      toast.error("Error", {
        description: "Failed to update category status",
      });
      throw err;
    }
  };

  return {
    categories,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handleSearch,
    handleAddCategory,
    handleUpdateCategory,
    handleToggleStatus,
  };
}
