import { z } from 'zod';
import { idSchema } from './common.schema';

export const followUserSchema = {
  body: z.object({
    followedId: idSchema.shape.id,
  }),
};

export const isFollowingSchema = {
  body: z.object({
    followerId: idSchema.shape.id,
    followedId: idSchema.shape.id,
  }),
};

export const sendConnectionSchema = {
  body: z.object({
    recipientId: idSchema.shape.id,
  }),
};

export const acceptConnectionSchema = {
  body: z.object({
    requesterId: idSchema.shape.id,
  }),
};

export const isConnectedSchema = {
  body: z.object({
    userId2: idSchema.shape.id,
  }),
};

export const withdrawConnectionSchema = {
  body: z.object({
    recipientId: idSchema.shape.id,
  }),
};
