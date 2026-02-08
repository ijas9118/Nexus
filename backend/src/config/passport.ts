import type { VerifyCallback } from "passport-oauth2";

import passport from "passport";
import passportGithub from "passport-github2";
import passportGoogle from "passport-google-oauth20";

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/utils/constants/index";

const GoogleStrategy = passportGoogle.Strategy;
const GithubStrategy = passportGithub.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
      scope: ["user:email"],
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: passportGithub.Profile,
      done: VerifyCallback,
    ) => {
      return done(null, profile); // Pass GitHub profile to callback
    },
  ),
);

export default passport;
