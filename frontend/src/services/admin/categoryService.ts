import api from "../api";
import { Category, PaginatedCategoryResponse } from "@/types/category";

const CategoryService = {
  createCategory: (name: string) =>
    api.post<Category[]>("admin/category", { name }).then((res) => res.data),

  getAllCategory: () =>
    api.get<Category[]>("admin/category").then((res) => res.data),

  getAllCategoriesWithPagination: (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ) =>
    api
      .get<PaginatedCategoryResponse>("admin/category", {
        params: { page, limit, search },
      })
      .then((res) => res.data),

  toggleStatus: (id: string) =>
    api.post<Category>(`admin/category/${id}/toggle`).then((res) => res.data),

  updateCategory: (id: string, newName: string) =>
    api
      .post<Category>("admin/category/update", { id, newName })
      .then((res) => res.data),
};

export default CategoryService;
