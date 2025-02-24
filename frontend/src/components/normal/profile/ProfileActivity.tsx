import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileReadingStreak from "./tab-contents/ProfileReadingStreak";
import ProfilePosts from "./tab-contents/ProfilePosts";
import ProfileUpvoted from "./tab-contents/ProfileUpvoted";

export default function ProfileActivity() {
  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <ProfileReadingStreak />
      </TabsContent>
      <TabsContent value="posts">
        <ProfilePosts />
      </TabsContent>
      <TabsContent value="upvoted">
        <ProfileUpvoted />
      </TabsContent>
    </Tabs>
  );
}
