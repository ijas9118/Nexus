import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Settings, Sparkles } from "lucide-react";
import { RootState } from "@/store/store";

export default function ProfileHeader({ tier }: { tier: string }) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-orange-200">
          <AvatarImage
            src={user?.profilePic || "/placeholder.svg"}
            alt={user?.name}
          />
          <AvatarFallback>
            {user?.name.charAt(0)}
            {user?.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="px-3 py-1 border-orange-200 flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-orange-700">{tier} Member</span>
        </Badge>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
