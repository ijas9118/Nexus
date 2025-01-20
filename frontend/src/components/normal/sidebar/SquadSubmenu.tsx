import JS from "@/components/ui/icons/JS";
import Next from "@/components/ui/icons/Next";
import NodejsIcon from "@/components/ui/icons/NodejsIcon";
import ReactIcon from "@/components/ui/icons/React";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { DiamondPlus, Podcast } from "lucide-react";
import React from "react";

const SquadSubmenu: React.FC = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Squads</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton>
          <Podcast />
          <span>Your Squads</span>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton>
              <JS />
              <span>Javascript</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton>
              <NodejsIcon />
              <span>Nodejs</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton>
              <ReactIcon />
              <span>React</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton>
              <Next />
              <span>Next</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
        <SidebarMenuButton>
          <DiamondPlus />
          <span>Create Squad</span>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SquadSubmenu;
