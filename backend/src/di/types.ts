export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  ContentRepository: Symbol.for("ContentRepository"),
  LikesRepository: Symbol.for("LikesRepository"),

  // Services
  UserService: Symbol.for("UserService"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AuthService: Symbol.for("AuthService"),
  ContentService: Symbol.for("ContentService"),
  LikesService: Symbol.for("LikesService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  ContentController: Symbol.for("ContentController"),
  LikesController: Symbol.for("LikesController"),
};
