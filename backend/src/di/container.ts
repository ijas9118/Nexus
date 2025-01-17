import { Container } from "inversify";
import { TYPES } from "./types";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { IUserService } from "../core/interfaces/services/IUserService";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };
