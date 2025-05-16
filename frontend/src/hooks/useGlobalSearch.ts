import { useQuery } from "@tanstack/react-query";
import SearchService from "@/services/SearchService";

export const useGlobalSearch = (query: string, limit = 20) => {
  return useQuery({
    queryKey: ["globalSearch", query, limit],
    queryFn: () => SearchService.globalSearch(query, limit),
    enabled: !!query, // only fetch when query is not empty
    staleTime: 5 * 60 * 1000, // optional caching
  });
};
