import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Heart,
  MessageCircle,
  Users,
  Award,
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { Badge } from "@/components/atoms/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { Card } from "@/components/molecules/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

// Mock notification data
const notifications = [
  {
    id: 1,
    type: "chat",
    read: false,
    timestamp: "2 minutes ago",
    title: "New message from Sarah Miller",
    description: "Hey, I loved your latest blog post about...",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Sarah Miller",
    actionUrl: "/messages/sarah-miller",
  },
  {
    id: 2,
    type: "blog",
    read: false,
    timestamp: "15 minutes ago",
    title: "James Wilson liked your post",
    description: 'Your blog "10 Tips for Better Productivity" received a like',
    avatar: "/placeholder.svg?height=40&width=40",
    name: "James Wilson",
    actionUrl: "/blog/10-tips-productivity",
    blogImage: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 3,
    type: "blog",
    read: true,
    timestamp: "1 hour ago",
    title: "Emily Rodriguez commented on your post",
    description:
      "This is exactly what I needed to read today! Thanks for sharing your insights.",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Emily Rodriguez",
    actionUrl: "/blog/10-tips-productivity#comments",
  },
  {
    id: 4,
    type: "squad",
    read: false,
    timestamp: "3 hours ago",
    title: 'Invitation to join "UX Designers" squad',
    description:
      "Daniel Brown invited you to join their squad of UX professionals",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Daniel Brown",
    actionUrl: "/squads/ux-designers",
    actionButtons: true,
  },
  {
    id: 5,
    type: "mentorship",
    read: true,
    timestamp: "5 hours ago",
    title: "Mentorship application approved",
    description:
      "Congratulations! Your application to become a mentor has been approved.",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "System",
    actionUrl: "/mentorship/dashboard",
  },
  {
    id: 6,
    type: "mentorship",
    read: false,
    timestamp: "1 day ago",
    title: "New mentorship session booked",
    description:
      "Olivia Garcia has booked a mentorship session with you for June 15th at 2:00 PM",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Olivia Garcia",
    actionUrl: "/mentorship/sessions",
    actionButtons: true,
  },
  {
    id: 7,
    type: "premium",
    read: true,
    timestamp: "2 days ago",
    title: "Premium subscription activated",
    description:
      "Your premium membership is now active. Enjoy exclusive features!",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "System",
    actionUrl: "/account/premium",
  },
  {
    id: 8,
    type: "chat",
    read: true,
    timestamp: "2 days ago",
    title: "New message from Noah Martinez",
    description: "I have a question about your mentorship program...",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Noah Martinez",
    actionUrl: "/messages/noah-martinez",
  },
  {
    id: 9,
    type: "blog",
    read: true,
    timestamp: "3 days ago",
    title: "Your blog post is trending",
    description:
      'Your article "The Future of AI" is gaining traction with 500+ views today!',
    avatar: "/placeholder.svg?height=40&width=40",
    name: "System",
    actionUrl: "/blog/future-of-ai",
    blogImage: "/placeholder.svg?height=60&width=80",
  },
  {
    id: 10,
    type: "squad",
    read: true,
    timestamp: "4 days ago",
    title: "New member joined your squad",
    description: 'Sophia Thompson joined your "Tech Writers" squad',
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Sophia Thompson",
    actionUrl: "/squads/tech-writers",
  },
];

// Helper function to get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "chat":
      return <MessageSquare className="h-4 w-4" />;
    case "blog":
      return type === "blog" ? (
        <Heart className="h-4 w-4" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      );
    case "squad":
      return <Users className="h-4 w-4" />;
    case "mentorship":
      return <Award className="h-4 w-4" />;
    case "premium":
      return <CreditCard className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

// Helper function to get notification type label
const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case "chat":
      return "Message";
    case "blog":
      return "Blog";
    case "squad":
      return "Squad";
    case "mentorship":
      return "Mentorship";
    case "premium":
      return "Premium";
    default:
      return "Notification";
  }
};

// Helper function to get notification type color
const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case "chat":
      return "bg-blue-100 text-blue-800";
    case "blog":
      return "bg-green-100 text-green-800";
    case "squad":
      return "bg-purple-100 text-purple-800";
    case "mentorship":
      return "bg-amber-100 text-amber-800";
    case "premium":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationState, setNotificationState] = useState(notifications);

  // Count unread notifications
  const unreadCount = notificationState.filter((n) => !n.read).length;

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all"
      ? notificationState
      : notificationState.filter((n) => n.type === activeTab);

  // Mark all as read
  const markAllAsRead = () => {
    setNotificationState(notificationState.map((n) => ({ ...n, read: true })));
  };

  // Mark single notification as read
  const markAsRead = (id: number) => {
    setNotificationState(
      notificationState.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-6 ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show unread only</DropdownMenuItem>
              <DropdownMenuItem>Sort by newest</DropdownMenuItem>
              <DropdownMenuItem>Sort by oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{unreadCount}</Badge>
          <span>unread notifications</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="blog">
            <MessageCircle className="mr-2 h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="squad">
            <Users className="mr-2 h-4 w-4" />
            Squads
          </TabsTrigger>
          <TabsTrigger value="mentorship">
            <Award className="mr-2 h-4 w-4" />
            Mentorship
          </TabsTrigger>
          <TabsTrigger value="premium">
            <CreditCard className="mr-2 h-4 w-4" />
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No notifications to display
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${!notification.read ? "bg-muted/50" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={notification.avatar}
                          alt={notification.name}
                        />
                        <AvatarFallback>
                          {notification.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.read && (
                              <Badge
                                variant="default"
                                className="h-2 w-2 rounded-full p-0"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getNotificationTypeColor(notification.type)}`}
                            >
                              {getNotificationIcon(notification.type)}
                              <span className="ml-1">
                                {getNotificationTypeLabel(notification.type)}
                              </span>
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>

                        {notification.blogImage && (
                          <div className="mt-2">
                            <img
                              src={notification.blogImage || "/placeholder.svg"}
                              alt="Blog thumbnail"
                              className="h-16 w-24 object-cover rounded-md"
                            />
                          </div>
                        )}

                        {notification.actionButtons && (
                          <div className="mt-3 flex items-center gap-2">
                            {notification.type === "squad" && (
                              <>
                                <Button size="sm">Accept</Button>
                                <Button variant="outline" size="sm">
                                  Decline
                                </Button>
                              </>
                            )}
                            {notification.type === "mentorship" && (
                              <>
                                <Button size="sm">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Add to Calendar
                                </Button>
                                <Button variant="outline" size="sm">
                                  Reschedule
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as {notification.read ? "unread" : "read"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>
                            Disable notifications like this
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
