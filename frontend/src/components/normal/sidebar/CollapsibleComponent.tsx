import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { ChevronDown } from "lucide-react";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SidebarCollapsibleSectionProps {
  title: string;
  items: { title: string; url: string; icon: React.ComponentType }[];
}

const CollapsibleComponent: FC<SidebarCollapsibleSectionProps> = ({ title, items }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMenuClick = (item: { title: string; url: string }) => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: item.title, url: item.url },
      ])
    );
    navigate(`${item.url}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <CollapsibleTrigger>
          {title}
          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </CollapsibleTrigger>
      </SidebarGroupLabel>
      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild onClick={() => handleMenuClick(item)}>
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
  );
};

export default CollapsibleComponent;
