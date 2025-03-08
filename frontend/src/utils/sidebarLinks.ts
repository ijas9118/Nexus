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
} from "lucide-react";

export const items = [
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
  {
    title: "Get Premium",
    url: "/getPremium",
    icon: Gem,
  },
];

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
