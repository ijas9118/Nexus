import { SEARCH_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "./api";

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
