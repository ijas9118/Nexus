import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Collapsible } from "@/components/molecules/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import NexusLogo from "@/components/icons/NexusLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/organisms/sidebar";
import {
  Atom,
  Bell,
  ChartColumn,
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
  Plus,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CollapsibleComponent from "@/components/organisms/CollapsibleComponent";

const mainItem = [
  { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
  { title: "Users", url: "users", icon: Users },
  { title: "Mentors", url: "mentors", icon: GraduationCap },
  { title: "Categories", url: "category", icon: Layers },
  { title: "Squads", url: "squads", icon: Compass },
  { title: "Contents", url: "contents", icon: Atom },
];

const interactionItems = [
  { title: "Comments", url: "comments", icon: MessageCircleMore },
  { title: "Notification", url: "notification", icon: Bell },
];

const revenueItems = [
  { title: "Pricing Plans", url: "plans", icon: CreditCard },
  { title: "Payment", url: "payment", icon: IndianRupee },
];

const otherItems = [
  { title: "Analytics", url: "analytics", icon: ChartColumn },
  { title: "Mentorship Type", url: "mentorship-type", icon: Leaf },
  { title: "Settings", url: "settings", icon: SettingsIcon },
];

const AdminAppSidebar = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();

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
        <SidebarGroup>
          <SidebarMenuButton
            asChild
            onClick={() => navigate("/admin/create-announcement")}
          >
            <div className="bg-primary text-secondary">
              <Plus />
              <span>New Announcement</span>
            </div>
          </SidebarMenuButton>
        </SidebarGroup>
        <div className="w-full flex items-center justify-center"></div>
        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Main" items={mainItem} />
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Interactions" items={interactionItems} />
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Revenue" items={revenueItems} />
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Others" items={otherItems} />
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-fit">
                  <Avatar
                    className={`rounded ${state === "collapsed" ? "-translate-x-3" : ""}`}
                  >
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">Admin</span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
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
