import { z } from 'zod';
import { idSchema } from './common.schema';

export const verifyContentSchema = {
  params: z.object({
    contentId: idSchema.shape.id,
  }),
};

export const toggleSchema = {
  params: z.object({
    id: idSchema.shape.id,
  }),
};

export const removeFromHistorySchema = {
  body: z.object({
    contentId: idSchema.shape.id,
  }),
};

export const addCommentSchema = {
  body: z.object({
    contentId: idSchema.shape.id,

    text: z
      .string({
        required_error: 'Text is required',
        invalid_type_error: 'Text must be a string',
      })
      .min(1, { message: 'Comment text cannot be empty' }),

    parentCommentId: idSchema.shape.id.optional(),
  }),
};
