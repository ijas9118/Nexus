import { Link } from "react-router-dom";

interface SquadAdminProps {
  name: string;
  username: string;
  profilePic: string;
}

export function SquadAdmin({ name, username, profilePic }: SquadAdminProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">ADMIN</h3>
      <Link to={`/profile/${username}`}>
        <div className="flex items-center gap-3 hover:bg-muted/60 transition-all cursor-pointer duration-300 p-2 rounded-xl">
          <div className="relative size-16 overflow-hidden rounded-full">
            <img
              src={profilePic || "/placeholder.svg"}
              alt={name}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-muted-foreground font-serif">
              @{username}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
