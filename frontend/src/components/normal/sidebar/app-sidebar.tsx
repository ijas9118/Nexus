import { ChevronUp, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
import { logout } from "@/services/authService";
import useLogout from "@/hooks/useLogout";

export function AppSidebar() {
  const navigate = useNavigate();
  const logoutUser = useLogout();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton
              className="bg-slate-950 hover:bg-slate-900 text-slate-100 hover:text-slate-100"
              onClick={() => navigate("/addPost")}
            >
              <Plus />
              <span>New Post</span>
            </SidebarMenuButton>
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>IA</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">Ijas Ahammed</span>
                    <span className="text-xs text-neutral-500">@ijasahmmed</span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Account Details</span>
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
