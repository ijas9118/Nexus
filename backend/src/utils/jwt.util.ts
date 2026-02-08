import jwt from "jsonwebtoken";

import type { JwtPayloadWithUser } from "../core/types/global/jwt";

import { env } from "../utils/env-validation";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET || "refresh_secret";

export function generateAccessToken(payload: JwtPayloadWithUser): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "5min" });
}

export function generateRefreshToken(user: object): string {
  return jwt.sign({ user }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JwtPayloadWithUser {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayloadWithUser;
}

export function verifyRefreshToken(token: string): JwtPayloadWithUser {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayloadWithUser;
}
