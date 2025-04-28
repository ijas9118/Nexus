import { Tabs, TabsList, TabsTrigger } from "@/components/organisms/tabs";
import React from "react";

interface ContentTypeTabProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const ContentTypeTab: React.FC<ContentTypeTabProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="mt-4 mb-8 space-y-4">
      <Tabs
        defaultValue="all"
        className="w-full"
        value={selectedTab}
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="blog">Blogs</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ContentTypeTab;
