import { Schema, model, Document, Types } from "mongoose";

interface IBookmark extends Document {
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  timestamp: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  contentId: {
    type: Schema.Types.ObjectId,
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

export { IBookmark, BookmarkModel };
