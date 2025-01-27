export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  ContentRepository: Symbol.for("ContentRepository"),

  // Services
  UserService: Symbol.for("UserService"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AuthService: Symbol.for("AuthService"),
  ContentService: Symbol.for("ContentService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  ContentController: Symbol.for("ContentController"),
};
