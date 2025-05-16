import api from "./api";
import { handleApi } from "@/utils/handleApi";

interface SearchResultItem {
  id: string;
  type: "blog" | "squad" | "user";
  title: string;
  snippet?: string;
  image?: string;
}

const SearchService = {
  globalSearch: (query: string, limit = 20) =>
    handleApi(() =>
      api.get<SearchResultItem[]>("/search", {
        params: { q: query, limit },
      }),
    ),
};

export default SearchService;
