import mongoose from 'mongoose';
import { IBookmark } from '../../../models/bookmarks.model';
import { BaseRepository } from '../../abstracts/base.repository';
import { IContent } from '@/models/content.model';

export interface IBookmarkRepository extends BaseRepository<IBookmark> {
  getBookmarks(userId: string): Promise<IContent[]>;
  updateBookmark(
    userId: mongoose.Types.ObjectId,
    contentIds: mongoose.Types.ObjectId[]
  ): Promise<void>;
}
