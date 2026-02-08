import type { VerifyCallback } from 'passport-oauth2';

import passport from 'passport';
import passportGithub from 'passport-github2';
import passportGoogle from 'passport-google-oauth20';

import { env } from '@/utils/env-validation';

const GoogleStrategy = passportGoogle.Strategy;
const GithubStrategy = passportGithub.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile as any);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: passportGithub.Profile,
      done: VerifyCallback
    ) => {
      return done(null, profile as any); // Pass GitHub profile to callback
    }
  )
);

export default passport;
