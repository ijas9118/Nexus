import { Container } from "inversify";
import { TYPES } from "./types";

import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserService } from "../core/interfaces/services/IUserService";

import { IContentRepository } from "../core/interfaces/repositories/IContentRepository";
import { ContentRepository } from "../repositories/content.repository";
import { IContentService } from "../core/interfaces/services/IContentService";
import { ContentService } from "../services/content.service";
import { IAuthController } from "../core/interfaces/controllers/IAuthController";
import { IContentController } from "../core/interfaces/controllers/IContentController";
import { ContentController } from "../controllers/content.controller";

import { IAdminAuthController } from "../core/interfaces/controllers/admin/IAdminAuthController";
import { AdminAuthController } from "../controllers/admin/admin.auth.controller";
import { IAdminRepository } from "../core/interfaces/repositories/IAdminRepository";
import { AdminRepository } from "../repositories/admin.repository";
import { AdminAuthService } from "../services/admin/admin.auth.service";

import { ILikesRepository } from "../core/interfaces/repositories/ILikesRepository";
import { LikesRepository } from "../repositories/likes.repository";
import { ILikeService } from "../core/interfaces/services/ILikeService";
import { LikeService } from "../services/like.service";
import { ILikesController } from "../core/interfaces/controllers/ILikesController";
import { LikesController } from "../controllers/likes.controller";

import { IBookmarkRepository } from "../core/interfaces/repositories/IBookmarnRepository";
import { BookmarkRepository } from "../repositories/bookmark.repository";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import { BookmarkService } from "../services/bookmark.service";
import { IBookmarkController } from "../core/interfaces/controllers/IBookmarkController";
import { BookmarkController } from "../controllers/bookmark.controller";

import { IAdminController } from "../core/interfaces/controllers/admin/IAdminController";
import { AdminController } from "../controllers/admin/admin.controller";

import { ICategoryRepository } from "../core/interfaces/repositories/ICategoryRepository";
import { CategoryRepository } from "../repositories/category.repository";
import { ICategoryService } from "../core/interfaces/services/ICategoryService";
import { CategoryService } from "../services/category.service";
import { ICategoryController } from "../core/interfaces/controllers/ICategoryController";
import { CategoryController } from "../controllers/category.controller";

import { ISquadRepository } from "../core/interfaces/repositories/ISquadRepository";
import { SquadRepository } from "../repositories/squad.repository";
import { ISquadService } from "../core/interfaces/services/ISquadService";
import { SquadService } from "../services/squad.service";
import { ISquadController } from "../core/interfaces/controllers/ISquadController";
import { SquadController } from "../controllers/squad.controller";
import { IUserController } from "../core/interfaces/controllers/IUserController";
import { UserController } from "../controllers/user.controller";
import { IMentorRepository } from "../core/interfaces/repositories/IMentorRepository";
import { MentorRepository } from "../repositories/mentor.repository";
import { IMentorService } from "../core/interfaces/services/IMentorService";
import { MentorService } from "../services/mentor.service";
import { IMentorController } from "../core/interfaces/controllers/IMentorController";
import { MentorController } from "../controllers/mentor.controller";

const container = new Container();

container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<AdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);

container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IUserController>(TYPES.UserController).to(UserController);

container.bind<IContentRepository>(TYPES.ContentRepository).to(ContentRepository);
container.bind<IContentService>(TYPES.ContentService).to(ContentService);
container.bind<IContentController>(TYPES.ContentController).to(ContentController);

container.bind<ILikesRepository>(TYPES.LikesRepository).to(LikesRepository);
container.bind<ILikeService>(TYPES.LikesService).to(LikeService);
container.bind<ILikesController>(TYPES.LikesController).to(LikesController);

container.bind<IBookmarkRepository>(TYPES.BookmarkRepository).to(BookmarkRepository);
container.bind<IBookmarkService>(TYPES.BookmarkService).to(BookmarkService);
container.bind<IBookmarkController>(TYPES.BookmarkController).to(BookmarkController);

container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<ICategoryController>(TYPES.CategoryController).to(CategoryController);

container.bind<ISquadRepository>(TYPES.SquadRepository).to(SquadRepository);
container.bind<ISquadService>(TYPES.SquadService).to(SquadService);
container.bind<ISquadController>(TYPES.SquadController).to(SquadController);

container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container.bind<IMentorService>(TYPES.MentorService).to(MentorService);
container.bind<IMentorController>(TYPES.MentorController).to(MentorController);

export { container };
