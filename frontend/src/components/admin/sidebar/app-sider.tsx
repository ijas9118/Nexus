import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NexusLogo from "@/components/ui/NexusLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Atom,
  Bell,
  ChartColumn,
  ChevronDown,
  ChevronUp,
  Compass,
  CreditCard,
  GraduationCap,
  IndianRupee,
  Layers,
  LayoutDashboard,
  MessageCircleMore,
  SettingsIcon,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const mainItem = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Mentors",
    url: "mentors",
    icon: GraduationCap,
  },
  {
    title: "Categories",
    url: "category",
    icon: Layers,
  },
  {
    title: "Squads",
    url: "squads",
    icon: Compass,
  },
  {
    title: "Contents",
    url: "contents",
    icon: Atom,
  },
];

const interactionItems = [
  {
    title: "Comments",
    url: "comments",
    icon: MessageCircleMore,
  },
  {
    title: "Notification",
    url: "notification",
    icon: Bell,
  },
];

const revenueItems = [
  {
    title: "Subscription",
    url: "subscription",
    icon: CreditCard,
  },
  {
    title: "Pricing",
    url: "pricing",
    icon: IndianRupee,
  },
];

const otherItems = [
  {
    title: "Analytics",
    url: "analytics",
    icon: ChartColumn,
  },
  {
    title: "Settings",
    url: "settings",
    icon: SettingsIcon,
  },
];

const AdminAppSidebar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (item: { title: string; url: string }) => {
    navigate(`${item.url}`);
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div>
                    <NexusLogo width={30} height={30} />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="text-lg font-bold">nexus.</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="w-full flex items-center justify-center"></div>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Main
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItem.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      onClick={() => handleMenuClick(item)}
                    >
                      <SidebarMenuButton asChild>
                        <div className="cursor-pointer">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Interactions
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {interactionItems.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      onClick={() => handleMenuClick(item)}
                    >
                      <SidebarMenuButton asChild>
                        <div className="cursor-pointer">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Revenue
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {revenueItems.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      onClick={() => handleMenuClick(item)}
                    >
                      <SidebarMenuButton asChild>
                        <div className="cursor-pointer">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Other
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {otherItems.map((item) => (
                    <SidebarMenuItem
                      key={item.title}
                      onClick={() => handleMenuClick(item)}
                    >
                      <SidebarMenuButton asChild>
                        <div className="cursor-pointer">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-fit">
                  <Avatar className="rounded">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">Admin</span>
                    {/* <span className="text-xs text-neutral-500">@ijasahmmed</span> */}
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminAppSidebar;
