import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import SquadService from "@/services/user/squadService";
import { setUserSquads } from "@/store/slices/userSquadsSlice";
import { Atom, DiamondPlus, Podcast } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SquadSubmenu: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const squads = useSelector((state: any) => state.userSquads.squads);

  useEffect(() => {
    const fetchUserSquads = async () => {
      try {
        const fetchedSquads = await SquadService.getUserJoinedSquads();
        console.log(fetchedSquads);
        dispatch(setUserSquads(fetchedSquads));
      } catch (error) {
        console.error("Error fetching user squads:", error);
      }
    };

    fetchUserSquads();
  }, [dispatch]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Squads</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton onClick={() => navigate("/squads")}>
          <Atom />
          <span>Explore Squads</span>
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Podcast />
          <span>Your Squads</span>
        </SidebarMenuButton>
        <SidebarMenuSub>
          {squads.map((squad: any) => (
            <SidebarMenuSubItem key={squad._id}>
              <SidebarMenuSubButton onClick={() => navigate(`/squads/${squad.id}`)}>
                <img src={squad.logo} alt="" className="w-6 rounded-full" />
                <span>{squad.name}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
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
