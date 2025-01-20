export interface DIContainer {
  UserRepository: any;
  UserService: any;
  AuthService: any;
  AuthController: any;
  ContentRepository: any;
  ContentService: any;
  ContentController: any;
}

export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserService"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  ContentRepository: Symbol.for("ContentRepository"),
  ContentService: Symbol.for("ContentService"),
  ContentController: Symbol.for("ContentController"),
};
