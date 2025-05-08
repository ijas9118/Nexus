import { ModeToggle } from "@/components/theme/mode-toggle";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/molecules/breadcrumb";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/organisms/sidebar";
import useLogout from "@/hooks/useLogout";
import type { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Premium from "@/components/icons/Premium";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/molecules/tooltip";
import Mentor from "@/components/icons/Mentor";
import { useTheme } from "@/components/theme/theme-provider";
import NPDark from "@/components/icons/NPDark";
import NPLight from "@/components/icons/NPLight";
import NotificationService from "@/services/notificationService";
import { setUnreadCount } from "@/store/slices/notificationSlice";
import { NotificationsDropdown } from "@/components/organisms/notifications-dropdown";
import { INotification } from "@/types/notification";

export default function Layout() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumb.breadcrumbs,
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount,
  );
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { theme } = useTheme();

  useEffect(() => {
    if (user?._id) {
      const fetchUnreadNotifications = async () => {
        try {
          const response = await NotificationService.getUserNotifications(
            user._id,
            false,
          );
          setNotifications(response);
          dispatch(setUnreadCount(response.length));
        } catch (error) {
          console.error("Failed to fetch unread notifications:", error);
        }
      };
      fetchUnreadNotifications();
    }
  }, [user?._id, dispatch]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      dispatch(setUnreadCount(unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.delete(notificationId);
      // Update local state
      const notification = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      // Only decrement unread count if the notification was unread
      if (notification && !notification.read) {
        dispatch(setUnreadCount(unreadCount - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b-[1px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center pl-4 pr-8 justify-between w-full">
            <div className="flex gap-2 items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) =>
                    index === breadcrumbs.length - 1 ? (
                      <BreadcrumbItem key={crumb.title || index}>
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <React.Fragment key={crumb.title || index}>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink
                            onClick={() => navigate(crumb.url)}
                            className="cursor-pointer"
                          >
                            {crumb.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </React.Fragment>
                    ),
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              {theme === "dark" ? (
                <NPDark className="h-7 w-8" />
              ) : (
                <NPLight className="h-7 w-8" />
              )}
              {user?.isPremium && user.role === "mentor" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Mentor />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mentor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : user?.isPremium ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Premium />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Premium member</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}

              <NotificationsDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />

              <Button
                className="hidden md:block"
                variant="outline"
                onClick={() => logoutUser()}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
