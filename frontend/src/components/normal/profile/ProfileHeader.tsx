import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProfileHeaderProps {
  profileUser: {
    id: string;
    name: string;
    username: string;
    profilePicture?: string;
    joinedAt: string;
    bio?: string;
  };
}

export default function ProfileHeader({ profileUser }: ProfileHeaderProps) {
  if (!profileUser) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Profile</h2>
        <Button className="text-sm font-medium">Edit profile</Button>
      </div>
      <Card className="p-6">
        <div className="mb-4 flex justify-start bg-red-200 rounded-lg">
          <img
            alt="Profile picture"
            src={
              profileUser.profilePicture ||
              "https://randomuser.me/api/portraits/men/4.jpg"
            }
            className="rounded-lg outline outline-4 outline-white dark:outline-black"
            width="80"
          />
        </div>
        <h1 className="text-start text-2xl font-semibold">{profileUser.name}</h1>
        <p className="text-start text-sm text-muted-foreground">
          @{profileUser.username} · Joined{" "}
          {/* {new Date(user.joinedAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })} */}
        </p>
        <div className="flex text-center justify-start gap-4 text-sm text-muted-foreground py-4">
          <div>
            <span className="font-semibold text-foreground text-lg">10</span> Followers
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">0</span> Following
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">12</span> Connections
          </div>
        </div>
        <Button className="w-full" variant="outline">
          {profileUser.bio ? "Edit bio" : "Add bio"}
        </Button>
      </Card>
    </div>
  );
}
