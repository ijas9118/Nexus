import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFollower extends Document {
  followerId: Types.ObjectId;
  followedId: Types.ObjectId;
}

const FollowerSchema: Schema = new Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FollowersModel = mongoose.model<IFollower>("Follower", FollowerSchema);
export default FollowersModel;
