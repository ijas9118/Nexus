import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import ProfilePosts from "./ProfilePosts";
import ProfileUpvoted from "./ProfileUpvoted";

export default function ProfileActivity() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <ProfilePosts />
      </TabsContent>
      <TabsContent value="upvoted">
        <ProfileUpvoted />
      </TabsContent>
    </Tabs>
  );
}
