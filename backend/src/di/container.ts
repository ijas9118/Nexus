import { Container } from "inversify";

import type { IAdminDashboardController } from "@/core/interfaces/controllers/i-admin-dashboard-controller";
import type { IBookingController } from "@/core/interfaces/controllers/i-booking-controller";
import type { IBookingPaymentController } from "@/core/interfaces/controllers/i-booking-payment-controller";
import type { IGlobalSearchController } from "@/core/interfaces/controllers/i-global-search-controller";
import type { IMentorController } from "@/core/interfaces/controllers/i-mentor-controller";
import type { IMentorDashboardController } from "@/core/interfaces/controllers/i-mentor-dashboard-controller";
import type { IMentorMetadataController } from "@/core/interfaces/controllers/i-mentor-metadata-controller";
import type { IMentorshipTypeController } from "@/core/interfaces/controllers/i-mentorship-type-controller";
import type { INotificationController } from "@/core/interfaces/controllers/i-notification-controller";
import type { INotificationTypeController } from "@/core/interfaces/controllers/i-notification-type-controller";
import type { IReviewController } from "@/core/interfaces/controllers/i-review-controller";
import type { ISubscriptionController } from "@/core/interfaces/controllers/i-subscription-controller";
import type { ITargetAudienceController } from "@/core/interfaces/controllers/i-target-audience-controller";
import type { ITimeSlotController } from "@/core/interfaces/controllers/i-time-slot-controller";
import type { IVoteController } from "@/core/interfaces/controllers/i-vote-controller";
import type { IWalletController } from "@/core/interfaces/controllers/i-wallet-controller";
import type { IWithdrawalRequestController } from "@/core/interfaces/controllers/i-withdrawal-request-controller";
import type { IBookingPaymentRepository } from "@/core/interfaces/repositories/i-booking-payment-repository";
import type { IBookingRepository } from "@/core/interfaces/repositories/i-booking-repository";
import type { IChatRepository } from "@/core/interfaces/repositories/i-chat-repository";
import type { IContentViewRepository } from "@/core/interfaces/repositories/i-content-view-repository";
import type { IGroupRepository } from "@/core/interfaces/repositories/i-group-repository";
import type { IMentorDashboardRepository } from "@/core/interfaces/repositories/i-mentor-dashboard-repository";
import type { IMentorMetadataRepository } from "@/core/interfaces/repositories/i-mentor-metadata-repository";
import type { IMentorRepository } from "@/core/interfaces/repositories/i-mentor-repository";
import type { IMessageRepository } from "@/core/interfaces/repositories/i-message-repository";
import type { INexusPointRepository } from "@/core/interfaces/repositories/i-nexus-point-repository";
import type { INotificationRepository } from "@/core/interfaces/repositories/i-notification-repository";
import type { INotificationTypeRepository } from "@/core/interfaces/repositories/i-notification-type-repository";
import type { IPaymentRepository } from "@/core/interfaces/repositories/i-payment-repository";
import type { IReviewRepository } from "@/core/interfaces/repositories/i-review-repository";
import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { ITargetAudienceRepository } from "@/core/interfaces/repositories/i-target-audience-repository";
import type { ITimeSlotRepository } from "@/core/interfaces/repositories/i-time-slot-repository";
import type { ITransactionRepository } from "@/core/interfaces/repositories/i-transaction-repository";
import type { IVoteRepository } from "@/core/interfaces/repositories/i-vote-repository";
import type { IWalletRepository } from "@/core/interfaces/repositories/i-wallet-repository";
import type { IWithdrawalRequestRepository } from "@/core/interfaces/repositories/i-withdrawal-request-repository";
import type { IAdminDashboardService } from "@/core/interfaces/services/i-admin-dashboard-service";
import type { IBookingPaymentService } from "@/core/interfaces/services/i-booking-payment-service";
import type { IBookingService } from "@/core/interfaces/services/i-booking-service";
import type { IChatService } from "@/core/interfaces/services/i-chat-service";
import type { IContentViewService } from "@/core/interfaces/services/i-content-view-service";
import type { IGlobalSearchService } from "@/core/interfaces/services/i-global-search-service";
import type { IGroupService } from "@/core/interfaces/services/i-group-service";
import type { IMentorDashboardService } from "@/core/interfaces/services/i-mentor-dashboard-service";
import type { IMentorMetadataService } from "@/core/interfaces/services/i-mentor-metadata-service";
import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";
import type { IMentorshipTypeService } from "@/core/interfaces/services/i-mentorship-type-service";
import type { IMessageService } from "@/core/interfaces/services/i-message-service";
import type { INotificationService } from "@/core/interfaces/services/i-notification-service";
import type { INotificationTypeService } from "@/core/interfaces/services/i-notification-type-service";
import type { IReviewService } from "@/core/interfaces/services/i-review-service";
import type { ISubscriptionService } from "@/core/interfaces/services/i-subscription-service";
import type { ITargetAudienceService } from "@/core/interfaces/services/i-target-audience-service";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";
import type { IVoteService } from "@/core/interfaces/services/i-vote-service";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";

import { AdminDashboardController } from "@/controllers/admin/admin.dashboard.controller";
import { BookingPaymentController } from "@/controllers/booking/booking-payment.controller";
import { BookingController } from "@/controllers/booking/booking.controller";
import { GlobalSearchController } from "@/controllers/common/global-search.controller";
import { NotificationTypeController } from "@/controllers/communication/notification-type.controller";
import { NotificationController } from "@/controllers/communication/notification.controller";
import { SocketController } from "@/controllers/communication/socket.controller";
import { ReviewController } from "@/controllers/content/review.controller";
import { VoteController } from "@/controllers/content/vote.controller";
import { MentorDashboardController } from "@/controllers/mentor/mentor-dashboard.controller";
import { MentorMetadataController } from "@/controllers/mentor/mentor-metadata.controller";
import { MentorController } from "@/controllers/mentor/mentor.controller";
import { MentorshipTypeController } from "@/controllers/mentor/mentorship-type.controller";
import { TargetAudienceController } from "@/controllers/mentor/target-audience.controller";
import { TimeSlotController } from "@/controllers/mentor/time-slot.controller";
import { WithdrawalRequestController } from "@/controllers/mentor/withdrawal-request.controller";
import { SubscriptionController } from "@/controllers/payment/subscription.controller";
import { WalletController } from "@/controllers/payment/wallet.controller";
import { BookingPaymentRepository } from "@/repositories/booking-payment.repository";
import { BookingRepository } from "@/repositories/booking.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { ContentViewRepository } from "@/repositories/content-view.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MentorDashboardRepository } from "@/repositories/mentor-dashboard.repository";
import { MentorMetadataRepository } from "@/repositories/mentor-metadata.repository";
import { MentorRepository } from "@/repositories/mentor.repository";
import { MentorshipTypeRepository } from "@/repositories/mentorship-type.repository";
import { MessageRepository } from "@/repositories/message.repository";
import { NexusPointRepository } from "@/repositories/nexus-point.repository";
import { NotificationTypeRepository } from "@/repositories/notification-type.repository";
import { NotificationRepository } from "@/repositories/notification.repository";
import { PaymentRepository } from "@/repositories/payment.repository";
import { ReviewRepository } from "@/repositories/review.repository";
import { SubscriptionRepository } from "@/repositories/subscription.repository";
import { TargetAudienceRepository } from "@/repositories/target-audience.repository";
import { TimeSlotRepository } from "@/repositories/time-slot.repository";
import { TransactionRepository } from "@/repositories/transactions.repository";
import { VoteRepository } from "@/repositories/votes.repository";
import { WalletRepository } from "@/repositories/wallet.repository";
import { WithdrawalRequestRepository } from "@/repositories/withdrawal-request.repository";
import { AdminDashboardService } from "@/services/admin/admin.dashboard.service";
import { BookingPaymentService } from "@/services/booking/booking-payment.service";
import { BookingService } from "@/services/booking/booking.service";
import { ContentViewService } from "@/services/common/content-view.service";
import { GlobalSearchService } from "@/services/common/global-search.service";
import { ChatService } from "@/services/communication/chat.service";
import { GroupService } from "@/services/communication/group.service";
import { MessageService } from "@/services/communication/message.service";
import { NotificationTypeService } from "@/services/communication/notification-type.service";
import { NotificationService } from "@/services/communication/notification.service";
import { BookmarkService } from "@/services/content/bookmark.service";
import { CategoryService } from "@/services/content/category.service";
import { CommentService } from "@/services/content/comment.service";
import { ContentService } from "@/services/content/content.service";
import { ReviewService } from "@/services/content/review.service";
import { SquadService } from "@/services/content/squad.service";
import { VoteService } from "@/services/content/vote.service";
import { MentorDashboardService } from "@/services/mentor/mentor-dashboard.service";
import { MentorMetadataService } from "@/services/mentor/mentor-metadata.service";
import { MentorService } from "@/services/mentor/mentor.service";
import { MentorshipTypeService } from "@/services/mentor/mentorship-type.service";
import { TargetAudienceService } from "@/services/mentor/target-audience.service";
import { TimeSlotService } from "@/services/mentor/time-slot.service";
import { PaymentServce } from "@/services/payment/payment.service";
import { PlanService } from "@/services/payment/plan.service";
import { SubscriptionService } from "@/services/payment/subscription.service";
import { WalletService } from "@/services/payment/wallet.service";
import { ConnectionService } from "@/services/user/connections.service";
import { FollowersService } from "@/services/user/followers.service";
import { HistoryService } from "@/services/user/history.service";
import { UserService } from "@/services/user/user.service";

import type { IAdminAuthController } from "../core/interfaces/controllers/admin/i-admin-auth-controller";
import type { IAdminController } from "../core/interfaces/controllers/admin/i-admin-controller";
import type { IAuthController } from "../core/interfaces/controllers/i-auth-controller";
import type { IBookmarkController } from "../core/interfaces/controllers/i-bookmark-controller";
import type { ICategoryController } from "../core/interfaces/controllers/i-category-controller";
import type { ICommentController } from "../core/interfaces/controllers/i-comment-controller";
import type { IConnectionsController } from "../core/interfaces/controllers/i-connections-controller";
import type { IContentController } from "../core/interfaces/controllers/i-content-controller";
import type { IFollowersController } from "../core/interfaces/controllers/i-followers-controller";
import type { IHistoryController } from "../core/interfaces/controllers/i-history-controller";
import type { IPaymentController } from "../core/interfaces/controllers/i-payment-controller";
import type { IPlanController } from "../core/interfaces/controllers/i-plan-controller";
import type { ISquadController } from "../core/interfaces/controllers/i-squad-controller";
import type { IUserController } from "../core/interfaces/controllers/i-user-controller";
import type { IAdminRepository } from "../core/interfaces/repositories/i-admin-repository";
import type { IBookmarkRepository } from "../core/interfaces/repositories/i-bookmarn-repository";
import type { ICategoryRepository } from "../core/interfaces/repositories/i-category-repository";
import type { ICommentRepository } from "../core/interfaces/repositories/i-comment-repository";
import type { IConnectionsRepository } from "../core/interfaces/repositories/i-connections-repository";
import type { IContentRepository } from "../core/interfaces/repositories/i-content-repository";
import type { IFollowersRepository } from "../core/interfaces/repositories/i-followers-repository";
import type { IHistoryRepository } from "../core/interfaces/repositories/i-history-repository";
import type { IPlanRepository } from "../core/interfaces/repositories/i-plan-repository";
import type { ISquadRepository } from "../core/interfaces/repositories/i-squad-repository";
import type { IUserRepository } from "../core/interfaces/repositories/i-user-repository";
import type { IBookmarkService } from "../core/interfaces/services/i-bookmark-service";
import type { ICategoryService } from "../core/interfaces/services/i-category-service";
import type { ICommentService } from "../core/interfaces/services/i-comment-service";
import type { IConnectionService } from "../core/interfaces/services/i-connection-service";
import type { IContentService } from "../core/interfaces/services/i-content-service";
import type { IEmailService } from "../core/interfaces/services/i-email-service";
import type { IFollowersService } from "../core/interfaces/services/i-followers-service";
import type { IHistoryService } from "../core/interfaces/services/i-history-service";
import type { IOTPService } from "../core/interfaces/services/i-otp-service";
import type { IPaymentService } from "../core/interfaces/services/i-payment-service";
import type { IPlanService } from "../core/interfaces/services/i-plan-service";
import type { ISquadService } from "../core/interfaces/services/i-squad-service";
import type { ITokenService } from "../core/interfaces/services/i-token-service";
import type { IUserService } from "../core/interfaces/services/i-user-service";

import { AdminAuthController } from "../controllers/admin/admin.auth.controller";
import { AdminController } from "../controllers/admin/admin.controller";
import { AuthController } from "../controllers/auth/auth.controller";
import { BookmarkController } from "../controllers/content/bookmark.controller";
import { CategoryController } from "../controllers/content/category.controller";
import { CommentController } from "../controllers/content/comment.controller";
import { ContentController } from "../controllers/content/content.controller";
import { SquadController } from "../controllers/content/squad.controller";
import { PaymentController } from "../controllers/payment/payment.controller";
import { PlanController } from "../controllers/payment/plan.controller";
import { ConnectionsController } from "../controllers/user/connections.controller";
import { FollowersController } from "../controllers/user/followers.controller";
import { HistoryController } from "../controllers/user/history.controller";
import { UserController } from "../controllers/user/user.controller";
import { AdminRepository } from "../repositories/admin.repository";
import { BookmarkRepository } from "../repositories/bookmark.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { ConnectionsRepository } from "../repositories/connections.repository";
import { ContentRepository } from "../repositories/content.repository";
import { FollowersRepository } from "../repositories/followers.repository";
import { HistoryRepository } from "../repositories/history.repository";
import { PlanRepository } from "../repositories/plan.repository";
import { SquadRepository } from "../repositories/squad.repository";
import { UserRepository } from "../repositories/user.repository";
import { AdminAuthService } from "../services/admin/admin.auth.service";
import { AuthService } from "../services/auth/auth.service";
import { EmailService } from "../services/auth/email.service";
import { OTPService } from "../services/auth/otp.service";
import { TokenService } from "../services/auth/token.service";
import { TYPES } from "./types";

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

container.bind<IMentorDashboardService>(TYPES.MentorDashboardService).to(MentorDashboardService);
container
  .bind<IMentorDashboardRepository>(TYPES.MentorDashboardRepository)
  .to(MentorDashboardRepository);
container
  .bind<IMentorDashboardController>(TYPES.MentorDashboardController)
  .to(MentorDashboardController);

container.bind<IGlobalSearchController>(TYPES.GlobalSearchController).to(GlobalSearchController);
container.bind<IGlobalSearchService>(TYPES.GlobalSearchService).to(GlobalSearchService);

container
  .bind<IAdminDashboardController>(TYPES.AdminDashboardController)
  .to(AdminDashboardController);
container.bind<IAdminDashboardService>(TYPES.AdminDashboardService).to(AdminDashboardService);

container.bind<ITransactionRepository>(TYPES.TransactionRepository).to(TransactionRepository);

container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository);
container.bind<IReviewService>(TYPES.ReviewService).to(ReviewService);
container.bind<IReviewController>(TYPES.ReviewController).to(ReviewController);

export { container };
