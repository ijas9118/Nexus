import { ChevronUp, Plus } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Collapsible } from "../molecules/collapsible";
import {
  getSidebarItems,
  mentorItems,
  networkItems,
} from "@/utils/sidebarLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import NexusLogo from "@/components/icons/NexusLogo";
import { Button } from "@/components/atoms/button";
import CollapsibleComponent from "./CollapsibleComponent";
import SquadSubmenu from "./SquadSubmenu";

export function AppSidebar() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);
  const items = getSidebarItems(user?.role as string);
  const dispatch = useDispatch();
  const { state } = useSidebar();

  const handleMenuClick = (url: string, title: string) => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title, url },
      ]),
    );
    navigate(url);
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
      <SidebarContent className="no-scrollbar">
        <SidebarGroup>
          <SidebarMenuButton asChild onClick={() => navigate("/addPost")}>
            <div className="bg-primary text-secondary">
              <Plus />
              <span>New Post</span>
            </div>
          </SidebarMenuButton>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Menu" items={items} />
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Network" items={networkItems} />
        </Collapsible>

        {user?.role === "mentor" && (
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleComponent title="Mentor Tools" items={mentorItems} />
          </Collapsible>
        )}

        <SquadSubmenu />
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
                    <AvatarImage src={user?.profilePic} />
                    <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">{user?.name}</span>
                    <span className="text-xs text-neutral-500">
                      @{user?.username}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() =>
                    handleMenuClick(`/profile/${user?.username}`, "Profile")
                  }
                >
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutUser()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
