import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be greater than 0'),
  interval: z.enum(['monthly', 'yearly'], {
    errorMap: () => ({ message: 'Interval must be either monthly or yearly' }),
  }),
  features: z.array(z.string()).min(1, 'Features must be an array with at least one item'),
  description: z.string().min(1, 'Description is required'),
});
