import api from "./api";
import { handleApi } from "@/utils/handleApi";
import { SEARCH_ROUTES } from "@/utils/constants";

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
      api.get<SearchResultItem[]>(SEARCH_ROUTES.GLOBAL, {
        params: { q: query, limit },
      }),
    ),
};

export default SearchService;
