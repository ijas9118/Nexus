import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { RootState } from "@/store/store";
import { getPlanLogo } from "@/utils/planLogo";

export default function ProfileHeader({
  tier,
  logo,
}: {
  tier: string;
  logo: string;
}) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage
            src={user?.profilePic || "/placeholder.svg"}
            alt={user?.name}
          />
          <AvatarFallback>
            {user?.name.charAt(0)}
            {user?.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{user?.name}</h1>
          <p className="text-muted-foreground text-sm">@{user?.username}</p>
        </div>
      </div>
      <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
        {getPlanLogo(logo, "h-4 w-4")}
        <span className="font-medium">{tier} Member</span>
      </Badge>
    </div>
  );
}
