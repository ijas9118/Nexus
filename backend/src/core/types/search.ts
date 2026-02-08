export interface SearchResultItem {
  id: string;
  type: "blog" | "squad" | "user";
  title: string;
  snippet?: string;
  image?: string;
}

export interface SearchCriteria {
  query: string;
  filters?: Record<string, any>; // e.g., { contentType: 'blog' }
  limit?: number;
  offset?: number;
  sortBy?: string; // e.g., 'relevance', 'date'
}
