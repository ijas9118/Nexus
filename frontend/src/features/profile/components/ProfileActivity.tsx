import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import ProfileReadingStreak from "./ProfileReadingStreak";
import ProfilePosts from "./ProfilePosts";
import ProfileUpvoted from "./ProfileUpvoted";

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
