import type { RequestHandler } from 'express';

export interface IAuthController {
  register: RequestHandler;
  verifyOTP: RequestHandler;
  resendOtp: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
  forgotPassword: RequestHandler;
  resetPassword: RequestHandler;
  refreshToken: RequestHandler;
  handleGoogleUser: RequestHandler;
  handleGithubUser: RequestHandler;
}
