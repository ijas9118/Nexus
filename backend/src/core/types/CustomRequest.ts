// types/googleRequest.ts
import { Request } from 'express';
import { Profile } from 'passport-google-oauth20';

export type GoogleRequest = Request & {
  user?: Profile; // Override user to be Profile | undefined
};
