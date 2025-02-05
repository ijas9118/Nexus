export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  ContentRepository: Symbol.for("ContentRepository"),
  LikesRepository: Symbol.for("LikesRepository"),
  BookmarkRepository: Symbol.for("BookmarkRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),

  // Services
  UserService: Symbol.for("UserService"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AuthService: Symbol.for("AuthService"),
  ContentService: Symbol.for("ContentService"),
  LikesService: Symbol.for("LikesService"),
  BookmarkService: Symbol.for("BookmarkService"),
  CategoryService: Symbol.for("CategoryService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminController: Symbol.for("AdminController"),
  ContentController: Symbol.for("ContentController"),
  LikesController: Symbol.for("LikesController"),
  BookmarkController: Symbol.for("BookmarkController"),
  CategoryController: Symbol.for("CategoryController"),
};
