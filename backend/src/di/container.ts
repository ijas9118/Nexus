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

import { IChatRepository } from '@/core/interfaces/repositories/IChatRepository';
import { IChatService } from '@/core/interfaces/services/IChatService';
import { ChatRepository } from '@/repositories/chat.repository';
import { ChatService } from '@/services/chat.service';

import { IGroupRepository } from '@/core/interfaces/repositories/IGroupRepository';
import { IGroupService } from '@/core/interfaces/services/IGroupService';
import { GroupRepository } from '@/repositories/group.repository';
import { GroupService } from '@/services/group.service';

import { IMessageRepository } from '@/core/interfaces/repositories/IMessageRepository';
import { IMessageService } from '@/core/interfaces/services/IMessageService';
import { MessageRepository } from '@/repositories/message.repository';
import { MessageService } from '@/services/message.service';
import { SocketController } from '@/controllers/socket.controller';

import { IMentorController } from '@/core/interfaces/controllers/IMentorController';
import { MentorController } from '@/controllers/mentor.controller';
import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { MentorService } from '@/services/mentor.service';
import { IMentorRepository } from '@/core/interfaces/repositories/IMentorRepository';
import { MentorRepository } from '@/repositories/mentor.repository';

import { ITimeSlotRepository } from '@/core/interfaces/repositories/ITimeSlotRepository';
import { TimeSlotRepository } from '@/repositories/time-slot.repository';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { TimeSlotService } from '@/services/time-slot.service';
import { ITimeSlotController } from '@/core/interfaces/controllers/ITimeSlotController';
import { TimeSlotController } from '@/controllers/time-slot.controller';

import { IVoteRepository } from '@/core/interfaces/repositories/IVoteRepository';
import { VoteRepository } from '@/repositories/votes.repository';
import { IVoteService } from '@/core/interfaces/services/IVoteService';
import { VoteService } from '@/services/vote.service';
import { IVoteController } from '@/core/interfaces/controllers/IVoteController';
import { VoteController } from '@/controllers/vote.controller';

import { IPaymentRepository } from '@/core/interfaces/repositories/IPaymentRepository';
import { PaymentRepository } from '@/repositories/payment.repository';

import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
import { SubscriptionRepository } from '@/repositories/subscription.repository';
import { ISubscriptionService } from '@/core/interfaces/services/ISubscriptionService';
import { SubscriptionService } from '@/services/subscription.service';
import { ISubscriptionController } from '@/core/interfaces/controllers/ISubscriptionController';
import { SubscriptionController } from '@/controllers/subscription.controller';

import { IContentViewService } from '@/core/interfaces/services/IContentViewService';
import { ContentViewService } from '@/services/content-view.service';
import { IContentViewRepository } from '@/core/interfaces/repositories/IContentViewRepository';
import { ContentViewRepository } from '@/repositories/content-view.repository';

import { IMentorshipTypeController } from '@/core/interfaces/controllers/IMentorshipTypeController';
import { MentorshipTypeController } from '@/controllers/mentorship-type.controller';
import { IMentorshipTypeService } from '@/core/interfaces/services/IMentorshipTypeService';
import { MentorshipTypeService } from '@/services/mentorship-type.service';
import { MentorshipTypeRepository } from '@/repositories/mentorship-type.repository';

import { MentorMetadataRepository } from '@/repositories/mentor-metadata.repository';
import { MentorMetadataService } from '@/services/mentor-metadata.service';
import { MentorMetadataController } from '@/controllers/mentor-metadata.controller';
import { IMentorMetadataRepository } from '@/core/interfaces/repositories/IMentorMetadataRepository';
import { IMentorMetadataService } from '@/core/interfaces/services/IMentorMetadataService';
import { IMentorMetadataController } from '@/core/interfaces/controllers/IMentorMetadataController';

import { ITargetAudienceRepository } from '@/core/interfaces/repositories/ITargetAudienceRepository';
import { TargetAudienceRepository } from '@/repositories/targetAudience.repository';
import { ITargetAudienceService } from '@/core/interfaces/services/ITargetAudienceService';
import { TargetAudienceService } from '@/services/targetAudience.service';
import { ITargetAudienceController } from '@/core/interfaces/controllers/ITargetAudienceController';
import { TargetAudienceController } from '@/controllers/targetAudience.controller';

import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { BookingRepository } from '@/repositories/ booking.repository';
import { IBookingService } from '@/core/interfaces/services/IBookingService';
import { BookingService } from '@/services/booking.service';
import { IBookingController } from '@/core/interfaces/controllers/IBookingController';
import { BookingController } from '@/controllers/booking.controller';

import { IBookingPaymentRepository } from '@/core/interfaces/repositories/IBookingPaymentRepository';
import { BookingPaymentRepository } from '@/repositories/bookingPayment.repository';
import { IBookingPaymentService } from '@/core/interfaces/services/IBookingPaymentService';
import { BookingPaymentService } from '@/services/bookingPayment.service';
import { IBookingPaymentController } from '@/core/interfaces/controllers/IBookingPaymentController';
import { BookingPaymentController } from '@/controllers/bookingPayment.controller';

import { INotificationTypeRepository } from '@/core/interfaces/repositories/INotificationTypeRepository';
import { NotificationTypeRepository } from '@/repositories/notificationType.repository';
import { INotificationTypeService } from '@/core/interfaces/services/INotificationTypeService';
import { NotificationTypeService } from '@/services/notificationType.service';
import { INotificationTypeController } from '@/core/interfaces/controllers/INotificationTypeController';
import { NotificationTypeController } from '@/controllers/notificationType.controller';

import { NotificationRepository } from '@/repositories/notification.repository';
import { INotificationRepository } from '@/core/interfaces/repositories/INotificationRepository';
import { INotificationService } from '@/core/interfaces/services/INotificationService';
import { INotificationController } from '@/core/interfaces/controllers/INotificationController';
import { NotificationService } from '@/services/notification.service';
import { NotificationController } from '@/controllers/notification.controller';

import { IWalletRepository } from '@/core/interfaces/repositories/IWalletRepository';
import { WalletRepository } from '@/repositories/wallet.repository';
import { IWalletService } from '@/core/interfaces/services/IWalletService';
import { WalletService } from '@/services/wallet.service';
import { IWalletController } from '@/core/interfaces/controllers/IWalletController';
import { WalletController } from '@/controllers/wallet.controller';

import { IWithdrawalRequestRepository } from '@/core/interfaces/repositories/IWithdrawalRequestRepository';
import { WithdrawalRequestRepository } from '@/repositories/withdrawalRequest.repository';
import { IWithdrawalRequestService } from '@/core/interfaces/services/IWithdrawalRequestService';
import { IWithdrawalRequestController } from '@/core/interfaces/controllers/IWithdrawalRequestController';
import { WithdrawalRequestController } from '@/controllers/withdrawalRequest.controller';
import { INexusPointRepository } from '@/core/interfaces/repositories/INexusPointRepository';
import { NexusPointRepository } from '@/repositories/nexusPoint.repository';

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

container.bind<IVoteRepository>(TYPES.VoteRepository).to(VoteRepository);
container.bind<IVoteService>(TYPES.VoteService).to(VoteService);
container.bind<IVoteController>(TYPES.VoteController).to(VoteController);

container.bind<IBookmarkRepository>(TYPES.BookmarkRepository).to(BookmarkRepository);
container.bind<IBookmarkService>(TYPES.BookmarkService).to(BookmarkService);
container.bind<IBookmarkController>(TYPES.BookmarkController).to(BookmarkController);

container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<ICategoryController>(TYPES.CategoryController).to(CategoryController);

container.bind<ISquadRepository>(TYPES.SquadRepository).to(SquadRepository);
container.bind<ISquadService>(TYPES.SquadService).to(SquadService);
container.bind<ISquadController>(TYPES.SquadController).to(SquadController);

container.bind<IHistoryRepository>(TYPES.HistoryRepository).to(HistoryRepository);
container.bind<IHistoryService>(TYPES.HistoryService).to(HistoryService);
container.bind<IHistoryController>(TYPES.HistoryController).to(HistoryController);

container.bind<IFollowersRepository>(TYPES.FollowersRepository).to(FollowersRepository);
container.bind<IFollowersService>(TYPES.FollowersService).to(FollowersService);
container.bind<IFollowersController>(TYPES.FollowersController).to(FollowersController);

container.bind<IConnectionsRepository>(TYPES.ConnectionsRepository).to(ConnectionsRepository);
container.bind<IConnectionService>(TYPES.ConnectionService).to(ConnectionService);
container.bind<IConnectionsController>(TYPES.ConnectionsController).to(ConnectionsController);

container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentRepository);
container.bind<ICommentService>(TYPES.CommentService).to(CommentService);
container.bind<ICommentController>(TYPES.CommentController).to(CommentController);

container.bind<IPlanRepository>(TYPES.PlanRepository).to(PlanRepository);
container.bind<IPlanService>(TYPES.PlanService).to(PlanService);
container.bind<IPlanController>(TYPES.PlanController).to(PlanController);

container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentServce);
container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController);
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);

container.bind<IChatRepository>(TYPES.ChatRepository).to(ChatRepository);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);

container.bind<IGroupRepository>(TYPES.GroupRepository).to(GroupRepository);
container.bind<IGroupService>(TYPES.GroupService).to(GroupService);

container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);
container.bind<IMessageService>(TYPES.MessageService).to(MessageService);

container.bind<SocketController>(TYPES.SocketController).to(SocketController);

container.bind<IMentorController>(TYPES.MentorController).to(MentorController);
container.bind<IMentorService>(TYPES.MentorService).to(MentorService);
container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);

container.bind<ITimeSlotRepository>(TYPES.TimeSlotRepository).to(TimeSlotRepository);
container.bind<ITimeSlotService>(TYPES.TimeSlotService).to(TimeSlotService);
container.bind<ITimeSlotController>(TYPES.TimeSlotController).to(TimeSlotController);

container.bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository);
container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);
container.bind<ISubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);

container.bind<IContentViewService>(TYPES.ContentViewService).to(ContentViewService);
container.bind<IContentViewRepository>(TYPES.ContentViewRepository).to(ContentViewRepository);

container
  .bind<IMentorshipTypeController>(TYPES.MentorshipTypeController)
  .to(MentorshipTypeController);
container.bind<IMentorshipTypeService>(TYPES.MentorshipTypeService).to(MentorshipTypeService);
container.bind(TYPES.MentorshipTypeRepository).to(MentorshipTypeRepository);

container
  .bind<IMentorMetadataRepository>(TYPES.MentorMetadataRepository)
  .to(MentorMetadataRepository);
container.bind<IMentorMetadataService>(TYPES.MentorMetadataService).to(MentorMetadataService);
container
  .bind<IMentorMetadataController>(TYPES.MentorMetadataController)
  .to(MentorMetadataController);

container
  .bind<ITargetAudienceRepository>(TYPES.TargetAudienceRepository)
  .to(TargetAudienceRepository);
container.bind<ITargetAudienceService>(TYPES.TargetAudienceService).to(TargetAudienceService);
container
  .bind<ITargetAudienceController>(TYPES.TargetAudienceController)
  .to(TargetAudienceController);

container.bind<IBookingRepository>(TYPES.BookingRepository).to(BookingRepository);
container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IBookingController>(TYPES.BookingController).to(BookingController);

container
  .bind<IBookingPaymentRepository>(TYPES.BookingPaymentRepository)
  .to(BookingPaymentRepository);
container.bind<IBookingPaymentService>(TYPES.BookingPaymentService).to(BookingPaymentService);
container
  .bind<IBookingPaymentController>(TYPES.BookingPaymentController)
  .to(BookingPaymentController);

container
  .bind<INotificationTypeRepository>(TYPES.NotificationTypeRepository)
  .to(NotificationTypeRepository);
container.bind<INotificationTypeService>(TYPES.NotificationTypeService).to(NotificationTypeService);
container
  .bind<INotificationTypeController>(TYPES.NotificationTypeController)
  .to(NotificationTypeController);

container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<INotificationController>(TYPES.NotificationController).to(NotificationController);

container.bind<IWalletRepository>(TYPES.WalletRepository).to(WalletRepository);
container.bind<IWalletService>(TYPES.WalletService).to(WalletService);
container.bind<IWalletController>(TYPES.WalletController).to(WalletController);

container
  .bind<IWithdrawalRequestRepository>(TYPES.WithdrawalRequestRepository)
  .to(WithdrawalRequestRepository);
container
  .bind<IWithdrawalRequestController>(TYPES.WithdrawalRequestController)
  .to(WithdrawalRequestController);

container.bind<INexusPointRepository>(TYPES.NexusPointRepository).to(NexusPointRepository);

export { container };
