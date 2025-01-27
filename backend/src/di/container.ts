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

const container = new Container();

container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<AdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container.bind<IAdminAuthController>(TYPES.AdminAuthController).to(AdminAuthController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

container.bind<IContentRepository>(TYPES.ContentRepository).to(ContentRepository);
container.bind<IContentService>(TYPES.ContentService).to(ContentService);
container.bind<IContentController>(TYPES.ContentController).to(ContentController);

container.bind<ILikesRepository>(TYPES.LikesRepository).to(LikesRepository);
container.bind<ILikeService>(TYPES.LikesService).to(LikeService);
container.bind<ILikesController>(TYPES.LikesController).to(LikesController);

export { container };
