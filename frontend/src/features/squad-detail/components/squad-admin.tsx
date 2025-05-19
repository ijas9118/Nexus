interface SquadAdminProps {
  name: string;
  profilePic: string;
}

export function SquadAdmin({ name, profilePic }: SquadAdminProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">ADMIN</h3>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={profilePic || "/placeholder.svg"}
            alt={name}
            className="object-cover"
          />
        </div>
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
}
