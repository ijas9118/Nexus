import { z } from 'zod';
import { emailSchema, nameSchema, passwordSchema } from './common.schema';

export const loginSchema = {
  body: z.object({
    email: emailSchema.shape.email,

    password: passwordSchema.shape.password,
  }),
};

export const registerSchema = {
  body: z.object({
    name: nameSchema.shape.name,

    email: emailSchema.shape.email,

    password: passwordSchema.shape.password,
  }),
};

export const verifyOTPSchema = {
  body: z.object({
    email: emailSchema.shape.email,

    otp: z
      .string({
        required_error: 'OTP is required',
        invalid_type_error: 'OTP must be a string',
      })
      .length(6, { message: 'OTP must be exactly 6 characters long' }),
  }),
};

export const resendOTPSchema = { body: emailSchema };

export const forgotPasswordSchema = { body: emailSchema };

export const resetPasswordSchema = {
  body: z.object({
    email: emailSchema.shape.email,

    token: z
      .string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      })
      .min(1, { message: 'Token cannot be empty' }),

    password: passwordSchema.shape.password,
  }),
};
