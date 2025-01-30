import { Schema, model, Document, Types } from "mongoose";

interface ILike extends Document {
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  timestamp: Date;
}

const LikeSchema = new Schema<ILike>({
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

const LikeModel = model<ILike>("Like", LikeSchema);

export { ILike, LikeModel };
