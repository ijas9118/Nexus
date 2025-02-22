import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { editProfileTabs } from "@/utils/navigationLinks";
import { FC } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="p-4 border-r md:min-h-screen w-full md:w-1/4">
      <div className="hidden md:block">
        {editProfileTabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "outline" : "ghost"}
            className="block w-full my-2"
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <ScrollArea className="w-full">
          <div className="flex space-x-4">
            {editProfileTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex py-2 items-center border-b-2 ${
                  activeTab === tab
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground"
                } px-4 text-sm font-medium transition-colors hover:text-foreground`}
              >
                {tab}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
