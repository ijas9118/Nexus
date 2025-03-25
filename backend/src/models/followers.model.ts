import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserFollow extends Document {
  userId: Types.ObjectId;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  connections: Types.ObjectId[];
}

const UserFollowSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pendingConnectionRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserFollowModel = mongoose.model<IUserFollow>('UserFollow', UserFollowSchema);
export default UserFollowModel;
