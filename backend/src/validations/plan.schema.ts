import { z } from 'zod';
import { nameSchema } from './common.schema';

export const createPlanSchema = {
  body: z.object({
    name: nameSchema.shape.name,

    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .positive({ message: 'Price must be greater than 0' }),

    interval: z.enum(['monthly', 'yearly'], {
      errorMap: () => ({ message: "Interval must be either 'monthly' or 'yearly'" }),
    }),

    features: z
      .array(
        z
          .string({
            invalid_type_error: 'Each feature must be a string',
          })
          .min(1, { message: 'Feature cannot be empty' })
      )
      .min(1, { message: 'At least one feature is required' }),

    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(1, { message: 'Description cannot be empty' }),
  }),
};
