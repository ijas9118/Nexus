import { Schema, model, Document, Types } from "mongoose";

interface IComment extends Document {
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  timestamp: Date;
}

const CommentSchema = new Schema<IComment>({
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
  comment: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = model<IComment>("Comment", CommentSchema);

export { IComment, CommentModel };
