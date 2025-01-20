import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const ContentTypeTab: React.FC = () => {
  return (
    <div className="mt-4 mb-8 space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ContentTypeTab;
