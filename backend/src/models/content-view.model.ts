import mongoose, { Document, Schema } from 'mongoose';

export interface IContentView extends Document {
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const ContentViewSchema = new Schema<IContentView>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
  },
  { timestamps: true }
);

const ContentViewModel = mongoose.model<IContentView>('ContentView', ContentViewSchema);
export default ContentViewModel;
