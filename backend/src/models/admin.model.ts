import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

export interface IAdmin extends Document<string> {
  name: string;
  email: string;
  password: string;
  role: string;
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
  role: {
    type: String,
  },
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
