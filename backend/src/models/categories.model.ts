import type { Document } from 'mongoose';

import { model, Schema } from 'mongoose';

interface ICategory extends Document<string> {
  name: string;
  squadCount: number;
  squads: string[];
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    squadCount: {
      type: Number,
      default: 0,
    },
    squads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Squads',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model<ICategory>('Category', CategorySchema);

export { CategoryModel, ICategory };
