import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

const AdminSchema: Schema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);
