import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfileHeader() {
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
            src="https://randomuser.me/api/portraits/men/4.jpg"
            className="rounded-lg outline outline-4 outline-white dark:outline-black"
            width="80"
          />
        </div>
        <h1 className="text-start text-2xl font-semibold">Ijas Ahammed</h1>
        <p className="text-start text-sm text-muted-foreground">
          @ijas9118 · Joined November 2024
        </p>
        <div className="flex text-center justify-start gap-4 text-sm text-muted-foreground py-4">
          <div>
            <span className="font-semibold text-foreground text-lg">0</span> Followers
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">1</span> Following
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">1</span> Connections
          </div>
        </div>
        <Button className="w-full" variant="outline">
          Add bio
        </Button>
      </Card>
    </div>
  );
}
