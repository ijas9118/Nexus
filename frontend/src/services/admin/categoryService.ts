import api from "../api";
import { Category } from "@/types/category";

const CategoryService = {
  getAllCategory: () =>
    api.get<Category[]>("admin/category").then((res) => res.data),

  toggleStatus: (id: string) =>
    api.post<Category>(`admin/category/${id}/toggle`).then((res) => res.data),

  updateCategory: (id: string, newName: string) =>
    api
      .post<Category>("admin/category/update", { id, newName })
      .then((res) => res.data),
};

export default CategoryService;
