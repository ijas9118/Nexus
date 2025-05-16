import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import FollowersList from "./followers-list";
import FollowingList from "./following-list";
import ConnectionsList from "./connections-list";

export default function ConnectionsLayout() {
  return (
    <Tabs defaultValue="followers" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
      </TabsList>

      <TabsContent value="followers" className="mt-0">
        <FollowersList />
      </TabsContent>

      <TabsContent value="following" className="mt-0">
        <FollowingList />
      </TabsContent>

      <TabsContent value="connections" className="mt-0">
        <ConnectionsList />
      </TabsContent>
    </Tabs>
  );
}
