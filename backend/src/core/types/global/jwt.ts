import type { JwtPayload } from "jsonwebtoken";

import type { UserRole } from "../user-types";

export interface JwtPayloadWithUser extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
}
