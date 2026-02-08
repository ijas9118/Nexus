import type { Document, Types } from "mongoose";

import { model, Schema } from "mongoose";

interface IBookmark extends Document {
  contentIds: Types.ObjectId[];
  userId: Types.ObjectId;
  timestamp: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  contentIds: {
    type: [Schema.Types.ObjectId],
    ref: "Content",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const BookmarkModel = model<IBookmark>("Bookmark", BookmarkSchema);

export { BookmarkModel, IBookmark };
