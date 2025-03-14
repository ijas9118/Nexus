import { z } from 'zod';
import { idSchema } from './common.schema';

export const createChatSchema = {
  body: z.object({
    member: idSchema.shape.id,
  }),
};

export const createNewMessageSchema = {
  body: z.object({
    chatId: idSchema.shape.id,

    text: z
      .string({
        required_error: 'Text is required',
        invalid_type_error: 'Text must be a string',
      })
      .min(1, { message: 'Text cannot be empty' }),
  }),
};
