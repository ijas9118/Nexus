import { z } from 'zod';

export const checkoutSessionSchema = {
  body: z.object({
    plan: z.object({
      _id: z.string().optional(),
      name: z.string().min(1, 'Plan name is required'),
      price: z.number().positive('Price must be a positive number'),
      description: z.string().min(1, 'Description is required'),
      interval: z.enum(['monthly', 'yearly']),
      features: z.array(z.string().min(1, 'Feature must be a non-empty string')),
      activeSubscribers: z.number().int().nonnegative().optional(),
      revenue: z.number().nonnegative().optional(),
      conversionRate: z
        .number()
        .nonnegative()
        .max(100, 'Conversion rate should be a percentage')
        .optional(),
    }),
    priceId: z.string().min(1, 'Price ID is required'),
  }),
};
