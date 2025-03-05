import mongoose, { Schema } from 'mongoose';

interface IHistory extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  readHistory: mongoose.Types.ObjectId[];
}

const HistorySchema = new Schema<IHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  readHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
  ],
});

const HistoryModel = mongoose.model<IHistory>('History', HistorySchema);
export { HistoryModel, IHistory };
