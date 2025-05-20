import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document<string> {
  avatarFallback: string;
  author: string;
  userName: string;
  contentType: string;
  title: string;
  date: string;
  upvoteCount: number;
  downvoteCount: number;
  squad: string;
  isPremium: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  content: string;
  commentCount: number;
  bookmarkCount: number;
  viewCount: number;
  isVerified: boolean;
  createdAt: string;
}

const ContentSchema: Schema = new Schema(
  {
    avatarFallback: {
      type: String,
      // required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['blog', 'video'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    squad: {
      type: mongoose.Types.ObjectId,
      ref: 'Squad',
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    content: {
      type: String,
      required: function (this: { contentType: string }) {
        return this.contentType === 'blog';
      },
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ContentSchema.index({ title: 'text', content: 'text' });

const ContentModel = mongoose.model<IContent>('Content', ContentSchema);
export default ContentModel;
