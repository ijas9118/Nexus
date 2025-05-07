export const TYPES = {
  // User
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),

  // Admin
  AdminRepository: Symbol.for('AdminRepository'),
  AdminAuthService: Symbol.for('AdminAuthService'),
  AdminController: Symbol.for('AdminController'),
  AdminAuthController: Symbol.for('AdminAuthController'),

  // Auth
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),

  // Content
  ContentRepository: Symbol.for('ContentRepository'),
  ContentService: Symbol.for('ContentService'),
  ContentController: Symbol.for('ContentController'),
  ContentViewRepository: Symbol.for('ContentViewRepository'),
  ContentViewService: Symbol.for('ContentViewService'),

  // Vote (a.k.a. Likes)
  VoteRepository: Symbol.for('VoteRepository'),
  VoteService: Symbol.for('VoteService'),
  VoteController: Symbol.for('LikesController'),

  // Bookmark
  BookmarkRepository: Symbol.for('BookmarkRepository'),
  BookmarkService: Symbol.for('BookmarkService'),
  BookmarkController: Symbol.for('BookmarkController'),

  // Category
  CategoryRepository: Symbol.for('CategoryRepository'),
  CategoryService: Symbol.for('CategoryService'),
  CategoryController: Symbol.for('CategoryController'),

  // Squad
  SquadRepository: Symbol.for('SquadRepository'),
  SquadService: Symbol.for('SquadService'),
  SquadController: Symbol.for('SquadController'),

  // Mentor
  MentorRepository: Symbol.for('MentorRepository'),
  MentorService: Symbol.for('MentorService'),
  MentorController: Symbol.for('MentorController'),

  // History
  HistoryRepository: Symbol.for('HistoryRepository'),
  HistoryService: Symbol.for('HistoryService'),
  HistoryController: Symbol.for('HistoryController'),

  // Followers
  FollowersRepository: Symbol.for('FollowersRepository'),
  FollowersService: Symbol.for('FollowersService'),
  FollowersController: Symbol.for('FollowersController'),

  // Connections
  ConnectionsRepository: Symbol.for('ConnectionsRepository'),
  ConnectionService: Symbol.for('IConnectionService'),
  ConnectionsController: Symbol.for('ConnectionsController'),

  // Comment
  CommentRepository: Symbol.for('CommentRepository'),
  CommentService: Symbol.for('CommentService'),
  CommentController: Symbol.for('CommentController'),

  // Plan
  PlanRepository: Symbol.for('PlanRepository'),
  PlanService: Symbol.for('PlanService'),
  PlanController: Symbol.for('PlanController'),

  // Payment
  PaymentRepository: Symbol.for('PaymentRepository'),
  PaymentService: Symbol.for('PaymentService'),
  PaymentController: Symbol.for('PaymentController'),

  // Chat
  ChatRepository: Symbol.for('ChatRepository'),
  ChatService: Symbol.for('ChatService'),
  SocketController: Symbol.for('SocketController'),

  // Group
  GroupRepository: Symbol.for('GroupRepository'),
  GroupService: Symbol.for('GroupService'),
  GroupController: Symbol.for('GroupController'),

  // Message
  MessageRepository: Symbol.for('MessageRepository'),
  MessageService: Symbol.for('MessageService'),
  MessageController: Symbol.for('MessageController'),

  // Subscription
  SubscriptionRepository: Symbol.for('SubscriptionRepository'),
  SubscriptionService: Symbol.for('SubscriptionService'),
  SubscriptionController: Symbol.for('SubscriptionController'),

  // Mentorship Type
  MentorshipTypeRepository: Symbol.for('MentorshipTypeRepository'),
  MentorshipTypeService: Symbol.for('MentorshipTypeService'),
  MentorshipTypeController: Symbol.for('MentorshipTypeController'),

  // Mentor Metadata
  MentorMetadataRepository: Symbol.for('MentorMetadataRepository'),
  MentorMetadataService: Symbol.for('MentorMetadataService'),
  MentorMetadataController: Symbol.for('MentorMetadataController'),

  // Target Audience
  TargetAudienceRepository: Symbol.for('TargetAudienceRepository'),
  TargetAudienceService: Symbol.for('TargetAudienceService'),
  TargetAudienceController: Symbol.for('TargetAudienceController'),

  // TimeSlot
  TimeSlotRepository: Symbol.for('TimeSlotRepository'),
  TimeSlotService: Symbol.for('TimeSlotService'),
  TimeSlotController: Symbol.for('TimeSlotController'),

  // Booking
  BookingRepository: Symbol.for('BookingRepository'),

  // Booking Payment
  BookingPaymentRepository: Symbol.for('BookingPaymentRepository'),
  BookingPaymentService: Symbol.for('BookingPaymentService'),
  BookingPaymentController: Symbol.for('BookingPaymentController'),

  // Miscellaneous / Utilities
  OTPService: Symbol.for('IOTPService'),
  EmailService: Symbol.for('IEmailService'),
  TokenService: Symbol.for('ITokenService'),
};
