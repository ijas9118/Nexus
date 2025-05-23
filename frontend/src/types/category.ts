export interface Category {
  _id: string;
  name: string;
  squadCount: number;
  isActive: boolean;
}

export interface PaginatedCategoryResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
