import {
  Bell,
  Bookmark,
  CircleCheckBig,
  Gem,
  History,
  Home,
  Send,
  Star,
  UsersRoundIcon,
  LayoutDashboard,
  CalendarClock,
  CreditCard,
  Clock,
  Inbox,
  Settings,
} from "lucide-react";

// Base sidebar items for all users
const baseItems = [
  {
    title: "My Feed",
    url: "/myFeed",
    icon: Home,
  },
  {
    title: "Following",
    url: "/following",
    icon: UsersRoundIcon,
  },
  {
    title: "Notification",
    url: "/notification",
    icon: Bell,
  },
  {
    title: "Bookmark",
    url: "/bookmark",
    icon: Bookmark,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
];

// Mentor-specific items
export const mentorItems = [
  {
    title: "Time Slots",
    url: "/mentor/time-slots",
    icon: Clock,
  },
  {
    title: "Scheduled Calls",
    url: "/mentor/scheduled-calls",
    icon: CalendarClock,
  },
  {
    title: "Payments",
    url: "/mentor/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/mentor/settings",
    icon: Settings,
  },
];

// role: "user" | "premium" | "mentor"
export const getSidebarItems = (role: string) => {
  if (role === "user") {
    return [
      ...baseItems,
      {
        title: "Get Premium",
        url: "/getPremium",
        icon: Gem,
      },
    ];
  }

  if (role === "premium") {
    return [
      ...baseItems,
      {
        title: "Premium Dashboard",
        url: "/premium",
        icon: Gem,
      },
    ];
  }

  return baseItems;
};

export const networkItems = [
  {
    title: "Connections",
    url: "/connections",
    icon: Star,
  },
  {
    title: "Mentors",
    url: "/mentors",
    icon: CircleCheckBig,
  },
  {
    title: "Messages",
    url: "/chat",
    icon: Send,
  },
];
