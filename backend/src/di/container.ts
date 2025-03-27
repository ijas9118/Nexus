import { Container } from 'inversify';
import { TYPES } from './types';

import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { IUserService } from '../core/interfaces/services/IUserService';

import { IContentRepository } from '../core/interfaces/repositories/IContentRepository';
import { ContentRepository } from '../repositories/content.repository';
import { IContentService } from '../core/interfaces/services/IContentService';
import { ContentService } from '../services/content.service';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { IContentController } from '../core/interfaces/controllers/IContentController';
import { ContentController } from '../controllers/content.controller';

import { IAdminAuthController } from '../core/interfaces/controllers/admin/IAdminAuthController';
import { AdminAuthController } from '../controllers/admin/admin.auth.controller';
import { IAdminRepository } from '../core/interfaces/repositories/IAdminRepository';
import { AdminRepository } from '../repositories/admin.repository';
import { AdminAuthService } from '../services/admin/admin.auth.service';

import { ILikesRepository } from '../core/interfaces/repositories/ILikesRepository';
import { LikesRepository } from '../repositories/likes.repository';
import { ILikeService } from '../core/interfaces/services/ILikeService';
import { LikeService } from '../services/like.service';
import { ILikesController } from '../core/interfaces/controllers/ILikesController';
import { LikesController } from '../controllers/likes.controller';

import { IBookmarkRepository } from '../core/interfaces/repositories/IBookmarnRepository';
import { BookmarkRepository } from '../repositories/bookmark.repository';
import { IBookmarkService } from '../core/interfaces/services/IBookmarkService';
import { BookmarkService } from '../services/bookmark.service';
import { IBookmarkController } from '../core/interfaces/controllers/IBookmarkController';
import { BookmarkController } from '../controllers/bookmark.controller';

import { IAdminController } from '../core/interfaces/controllers/admin/IAdminController';
import { AdminController } from '../controllers/admin/admin.controller';

import { ICategoryRepository } from '../core/interfaces/repositories/ICategoryRepository';
import { CategoryRepository } from '../repositories/category.repository';
import { ICategoryService } from '../core/interfaces/services/ICategoryService';
import { CategoryService } from '../services/category.service';
import { ICategoryController } from '../core/interfaces/controllers/ICategoryController';
import { CategoryController } from '../controllers/category.controller';

import { ISquadRepository } from '../core/interfaces/repositories/ISquadRepository';
import { SquadRepository } from '../repositories/squad.repository';
import { ISquadService } from '../core/interfaces/services/ISquadService';
import { SquadService } from '../services/squad.service';
import { ISquadController } from '../core/interfaces/controllers/ISquadController';
import { SquadController } from '../controllers/squad.controller';

import { IUserController } from '../core/interfaces/controllers/IUserController';
import { UserController } from '../controllers/user.controller';

import { IMentorRepository } from '../core/interfaces/repositories/IMentorRepository';
import { MentorRepository } from '../repositories/mentor.repository';
import { IMentorService } from '../core/interfaces/services/IMentorService';
import { MentorService } from '../services/mentor.service';
import { IMentorController } from '../core/interfaces/controllers/IMentorController';
import { MentorController } from '../controllers/mentor.controller';

import { IHistoryRepository } from '../core/interfaces/repositories/IHistoryRepository';
import { HistoryRepository } from '../repositories/history.repository';
import { IHistoryService } from '../core/interfaces/services/IHistoryService';
import { HistoryService } from '../services/history.service';
import { IHistoryController } from '../core/interfaces/controllers/IHistoryController';
import { HistoryController } from '../controllers/history.controller';

import { IFollowersRepository } from '../core/interfaces/repositories/IFollowersRepository';
import { FollowersRepository } from '../repositories/followers.repository';
import { IFollowersService } from '../core/interfaces/services/IFollowersService';
import { FollowersService } from '../services/followers.service';
import { IFollowersController } from '../core/interfaces/controllers/IFollowersController';
import { FollowersController } from '../controllers/followers.controller';

import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import { MessageRepository } from '../repositories/message.repository';
import { MessageService } from '../services/message.service';
import { IMessageService } from '../core/interfaces/services/IMessageService';
import { IMessageController } from '../core/interfaces/controllers/IMessageController';
import { MessageController } from '../controllers/message.controller';

import { IOTPService } from '../core/interfaces/services/IOTPService';
import { OTPService } from '../services/auth/otp.service';

import { IEmailService } from '../core/interfaces/services/IEmailService';
import { EmailService } from '../services/auth/email.service';

import { ITokenService } from '../core/interfaces/services/ITokenService';
import { TokenService } from '../services/auth/token.service';

import { IConnectionsRepository } from '../core/interfaces/repositories/IConnectionsRepository';
import { ConnectionsRepository } from '../repositories/connections.repository';
import { IConnectionService } from '../core/interfaces/services/IConnectionService';
import { ConnectionService } from '../services/connections.service';
import { IConnectionsController } from '../core/interfaces/controllers/IConnectionsController';
import { ConnectionsController } from '../controllers/connections.controller';

import { ICommentRepository } from '../core/interfaces/repositories/ICommentRepository';
import { CommentRepository } from '../repositories/comment.repository';
import { ICommentService } from '../core/interfaces/services/ICommentService';
import { CommentService } from '../services/comment.service';
import { ICommentController } from '../core/interfaces/controllers/ICommentController';
import { CommentController } from '../controllers/comment.controller';

import { IPlanService } from '../core/interfaces/services/IPlanService';
import { PlanService } from '../services/plan.service';
import { IPlanController } from '../core/interfaces/controllers/IPlanController';
import { PlanController } from '../controllers/plan.controller';
import { IPlanRepository } from '../core/interfaces/repositories/IPlanRepository';
import { PlanRepository } from '../repositories/plan.repository';

import { IPaymentService } from '../core/interfaces/services/IPaymentService';
import { PaymentServce } from '../services/payment.service';
import { IPaymentController } from '../core/interfaces/controllers/IPaymentController';
import { PaymentController } from '../controllers/payment.controller';
import { IImageService } from '@/core/interfaces/services/IImageService';
import { ImageService } from '@/services/imageService';
import { ICloudinaryRepository } from '@/core/interfaces/repositories/ICloudinaryRepository';
import { CloudinaryRepository } from '@/repositories/cloudinaryRepository';

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
container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

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

container.bind<IHistoryRepository>(TYPES.HistoryRepository).to(HistoryRepository);
container.bind<IHistoryService>(TYPES.HistoryService).to(HistoryService);
container.bind<IHistoryController>(TYPES.HistoryController).to(HistoryController);

container.bind<IFollowersRepository>(TYPES.FollowersRepository).to(FollowersRepository);
container.bind<IFollowersService>(TYPES.FollowersService).to(FollowersService);
container.bind<IFollowersController>(TYPES.FollowersController).to(FollowersController);

container.bind<IConnectionsRepository>(TYPES.ConnectionsRepository).to(ConnectionsRepository);
container.bind<IConnectionService>(TYPES.ConnectionService).to(ConnectionService);
container.bind<IConnectionsController>(TYPES.ConnectionsController).to(ConnectionsController);

container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IMessageService>(TYPES.MessageService).to(MessageService);
container.bind<IMessageController>(TYPES.MessageController).to(MessageController);

container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentRepository);
container.bind<ICommentService>(TYPES.CommentService).to(CommentService);
container.bind<ICommentController>(TYPES.CommentController).to(CommentController);

container.bind<IPlanRepository>(TYPES.PlanRepository).to(PlanRepository);
container.bind<IPlanService>(TYPES.PlanService).to(PlanService);
container.bind<IPlanController>(TYPES.PlanController).to(PlanController);

container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentServce);
container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController);

container.bind<IImageService>(TYPES.ImageService).to(ImageService);
container.bind<ICloudinaryRepository>(TYPES.CloudinaryRepository).to(CloudinaryRepository);

export { container };
