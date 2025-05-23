import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryService from "@/services/admin/categoryService";
import type { Category } from "@/types/category";
import { toast } from "sonner";

// Query key for categories
export const categoriesKeys = {
  all: ["categories"] as const,
};

// Hook for fetching all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: CategoryService.getAllCategory,
  });
};

// Hook for toggling category status
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      CategoryService.toggleStatus(categoryId),
    // When mutate is called:
    onMutate: async (categoryId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoriesKeys.all });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<Category[]>(
        categoriesKeys.all,
      );

      // Optimistically update to the new value
      if (previousCategories) {
        queryClient.setQueryData<Category[]>(categoriesKeys.all, (old) => {
          if (!old) return [];
          return old.map((category) => {
            if (category._id === categoryId) {
              return { ...category, isActive: !category.isActive };
            }
            return category;
          });
        });
      }

      // Return a context object with the snapshotted value
      return { previousCategories };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, categoryId, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<Category[]>(
          categoriesKeys.all,
          context.previousCategories,
        );
      }
      toast.error("Error", {
        description: "Failed to update category status",
      });
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
};

// Hook for updating category name
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      CategoryService.updateCategory(id, newName),
    // When mutate is called:
    onMutate: async ({ id, newName }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoriesKeys.all });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<Category[]>(
        categoriesKeys.all,
      );

      // Optimistically update to the new value
      if (previousCategories) {
        queryClient.setQueryData<Category[]>(categoriesKeys.all, (old) => {
          if (!old) return [];
          return old.map((category) => {
            if (category._id === id) {
              return { ...category, name: newName };
            }
            return category;
          });
        });
      }

      // Return a context object with the snapshotted value
      return { previousCategories };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<Category[]>(
          categoriesKeys.all,
          context.previousCategories,
        );
      }
      toast.error("Error", {
        description: "Failed to update category name",
      });
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
    onSuccess: () => {
      toast.success("Success", {
        description: "Category updated successfully",
      });
    },
  });
};
