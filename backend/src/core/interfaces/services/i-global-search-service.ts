import type { SearchCriteria, SearchResultItem } from '@/core/types/search';

export interface IGlobalSearchService {
  search: (criteria: SearchCriteria) => Promise<SearchResultItem[]>;
}
