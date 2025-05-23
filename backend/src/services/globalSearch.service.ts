import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { ISquadRepository } from '@/core/interfaces/repositories/ISquadRepository';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { IGlobalSearchService } from '@/core/interfaces/services/IGlobalSearchService';
import { SearchCriteria, SearchResultItem } from '@/core/types/search';
import { TYPES } from '@/di/types';
import { inject } from 'inversify';

export class GlobalSearchService implements IGlobalSearchService {
  constructor(
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
    @inject(TYPES.SquadRepository) private squadRepo: ISquadRepository,
    @inject(TYPES.UserRepository) private userRepo: IUserRepository
  ) {}

  async search(criteria: SearchCriteria): Promise<SearchResultItem[]> {
    const [blogs, squads, users] = await Promise.all([
      this.contentRepo.search({ ...criteria, filters: { contentType: 'blog' } }),
      this.squadRepo.search(criteria),
      this.userRepo.search(criteria),
    ]);

    // Combine all results
    let combined = [...blogs, ...squads, ...users];

    // Limit results globally
    if (criteria.limit) {
      combined = combined.slice(0, criteria.limit);
    }

    return combined;
  }
}
