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

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

container.bind<IContentRepository>(TYPES.ContentRepository).to(ContentRepository);
container.bind<IContentService>(TYPES.ContentService).to(ContentService);
container.bind<IContentController>(TYPES.ContentController).to(ContentController);

export { container };
