import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Atom } from "lucide-react";
import { useSelector } from "react-redux";

export default function SquadsList() {
  const squads = useSelector((state: any) => state.userSquads.squads);

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-medium">
        <Atom />
        Active in these Squads
      </h3>
      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-4">
          {squads.map((squad: any) => (
            <Card key={squad.handle} className="px-3 py-2">
              <div className="flex items-center gap-4">
                <img
                  alt={`${squad.name} logo`}
                  className="rounded-lg"
                  src={squad.logo || "https://placehold.co/100/000000/FFF"}
                  width="60"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link className="font-semibold hover:underline" to="#">
                      {squad.name}
                    </Link>
                    {squad.isAdmin && <Badge>Admin</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">@{squad.handle}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {squad.members.length} members
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <Button className="mt-4 w-full" variant="outline">
        Show All Squads
      </Button>
    </div>
  );
}
