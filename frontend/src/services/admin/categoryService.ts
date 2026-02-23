import api from "../api";
import { Category, PaginatedCategoryResponse } from "@/types/category";
import { ADMIN_ROUTES } from "@/utils/constants";

const CategoryService = {
  createCategory: (name: string) =>
    api
      .post<Category[]>(ADMIN_ROUTES.CATEGORY, { name })
      .then((res) => res.data),

  getAllCategory: () =>
    api.get<Category[]>(ADMIN_ROUTES.CATEGORY).then((res) => res.data),

  getAllCategoriesWithPagination: (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ) =>
    api
      .get<PaginatedCategoryResponse>(ADMIN_ROUTES.CATEGORY, {
        params: { page, limit, search },
      })
      .then((res) => res.data),

  toggleStatus: (id: string) =>
    api
      .post<Category>(`${ADMIN_ROUTES.CATEGORY}/${id}/toggle`)
      .then((res) => res.data),

  updateCategory: (id: string, newName: string) =>
    api
      .post<Category>(`${ADMIN_ROUTES.CATEGORY}/update`, { id, newName })
      .then((res) => res.data),
};

export default CategoryService;
