import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  status: 'active' | 'reported' | 'deleted';
}

const CommentSchema: Schema = new Schema(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // Null for top-level comments
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'reported', 'deleted'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
export default CommentModel;
