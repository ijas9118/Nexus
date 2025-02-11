export const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  AdminRepository: Symbol.for("AdminRepository"),
  ContentRepository: Symbol.for("ContentRepository"),
  LikesRepository: Symbol.for("LikesRepository"),
  BookmarkRepository: Symbol.for("BookmarkRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  SquadRepository: Symbol.for("SquadRepository"),
  MentorRepository: Symbol.for("MentorRepository"),

  // Services
  UserService: Symbol.for("UserService"),
  AdminAuthService: Symbol.for("AdminAuthService"),
  AuthService: Symbol.for("AuthService"),
  ContentService: Symbol.for("ContentService"),
  LikesService: Symbol.for("LikesService"),
  BookmarkService: Symbol.for("BookmarkService"),
  CategoryService: Symbol.for("CategoryService"),
  SquadService: Symbol.for("SquadService"),
  MentorService: Symbol.for("MentorService"),

  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminController: Symbol.for("AdminController"),
  ContentController: Symbol.for("ContentController"),
  LikesController: Symbol.for("LikesController"),
  BookmarkController: Symbol.for("BookmarkController"),
  CategoryController: Symbol.for("CategoryController"),
  SquadController: Symbol.for("SquadController"),
  MentorController: Symbol.for("MentorController"),
};
