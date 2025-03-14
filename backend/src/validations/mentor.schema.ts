import { z } from 'zod';
import { emailSchema, nameSchema, passwordSchema } from './common.schema';

export const sendInvitationSchema = {
  body: z.object({
    email: emailSchema.shape.email,

    specialization: z
      .string({
        required_error: 'Specialization is required',
        invalid_type_error: 'Specialization must be a string',
      })
      .min(1, { message: 'Specialization cannot be empty' }),

    name: nameSchema.shape.name,
  }),
};

export const acceptInvitationSchema = {
  body: z.object({
    token: z
      .string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      })
      .min(1, { message: 'Token cannot be empty' }),
  }),
};

export const completeProfileSchema = {
  body: z.object({
    email: emailSchema.shape.email,
    name: nameSchema.shape.name,
    password: passwordSchema.shape.password,
  }),
};
