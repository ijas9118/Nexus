import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  Trash2,
  CalendarPlus,
  MessageSquare,
  BellIcon,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ScrollArea } from "./scroll-area";
import { INotification } from "@/types/notification";

interface NotificationsDropdownProps {
  notifications: INotification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDelete: (notificationId: string) => Promise<void>;
}

export function NotificationsDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onDelete,
}: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Get icon component based on notification type
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "CalendarPlus":
        return <CalendarPlus className="h-4 w-4" />;
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    setLoading((prev) => ({ ...prev, [notificationId]: true }));
    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  // Handle deleting a notification
  const handleDelete = async (notificationId: string) => {
    setLoading((prev) => ({ ...prev, [notificationId]: true }));
    try {
      await onDelete(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  // Format the date to a relative time (e.g., "2 hours ago")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative mx-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center rounded-full text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b py-3 px-4">
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "No new notifications"}
            </CardDescription>
          </CardHeader>
          <ScrollArea className="h-[300px]">
            <CardContent className="p-0">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const notificationType =
                      typeof notification.notificationTypeId === "object"
                        ? notification.notificationTypeId
                        : { icon: "Bell", iconColor: "#6b7280" };

                    return (
                      <div
                        key={notification._id}
                        className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: `${notificationType.iconColor}15`,
                            color: notificationType.iconColor,
                          }}
                        >
                          {typeof notificationType === "object" &&
                            getIconComponent(notificationType.icon)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {notification.heading}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              disabled={loading[notification._id]}
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(notification._id)}
                              disabled={loading[notification._id]}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(notification._id)}
                              disabled={loading[notification._id]}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're all caught up! We'll notify you when something new
                    arrives.
                  </p>
                </div>
              )}
            </CardContent>
          </ScrollArea>
          {notifications.length > 0 && (
            <CardFooter className="border-t p-3 flex justify-center">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
