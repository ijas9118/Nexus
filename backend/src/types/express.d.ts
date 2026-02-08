import type { UserRole } from "@/core/types/user-types";

declare global {
  namespace Express {
    interface User {
      _id: string;
      name: string;
      email: string;
      role: UserRole;
      mentorId?: string;
    }

    interface Request {
      user?: User;
    }
  }
}
