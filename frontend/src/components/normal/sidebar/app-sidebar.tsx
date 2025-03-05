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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Collapsible } from "../../ui/collapsible";
import CollapsibleComponent from "./CollapsibleComponent";
import SquadSubmenu from "./SquadSubmenu";
import { items, networkItems } from "@/utils/sidebarLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import NexusLogo from "@/components/ui/NexusLogo";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Button onClick={() => navigate("/addPost")}>
              <Plus />
              <span>New Post</span>
            </Button>
          </SidebarMenu>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Menu" items={items} />
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <CollapsibleComponent title="Network" items={networkItems} />
        </Collapsible>

        <SquadSubmenu />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-fit">
                  <Avatar className="rounded">
                    <AvatarImage src={user?.profilePic} />
                    <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">{user?.name}</span>
                    {/* <span className="text-xs text-neutral-500">@ijasahmmed</span> */}
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
