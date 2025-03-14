import { z } from 'zod';
import { idSchema, nameSchema } from './common.schema';

export const toggleCategorySchema = {
  params: z.object({
    id: idSchema.shape.id,
  }),
};

export const createCategorySchema = {
  body: z.object({
    name: nameSchema.shape.name,
  }),
};

export const updateCategorySchema = {
  body: z.object({
    id: z.string({
      required_error: 'ID is required',
      invalid_type_error: 'ID must be a string',
    }),
    newName: nameSchema.shape.name,
  }),
};
