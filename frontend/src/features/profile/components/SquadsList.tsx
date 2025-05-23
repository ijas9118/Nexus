import { Card } from "@/components/molecules/card";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Badge } from "@/components/atoms/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { Atom } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SquadService from "@/services/user/squadService";

export default function SquadsList({
  profileUserId,
}: {
  profileUserId: string;
}) {
  const {
    data: squads = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userSquads", profileUserId],
    queryFn: () => SquadService.getJoinedSquads(profileUserId),
    enabled: !!profileUserId,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading squads...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">
        Failed to load squads. {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-medium">
        <Atom />
        Active in these Squads
      </h3>

      {squads.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4 p-4 border rounded-lg">
          <p className="text-muted-foreground">
            You're not part of any squads yet!
          </p>
          <Button variant="outline" asChild>
            <Link to="/squads">Discover Squads</Link>
          </Button>
        </div>
      ) : (
        <ScrollArea
          className={`w-full ${squads.length > 3 ? "h-[350px]" : "min-h-[100px]"}`}
        >
          <div className="space-y-4">
            {squads.map((squad) => (
              <Card key={squad.handle} className="px-3 py-2">
                <div className="flex items-center gap-4">
                  <img
                    alt={`${squad.name} logo`}
                    className="rounded-lg"
                    src={squad.logo || "https://placehold.co/100/000000/FFF"}
                    width="60"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        className="font-semibold hover:underline"
                        to={`/squads/${squad.handle}`}
                      >
                        {squad.name}
                      </Link>
                      {squad.isAdmin && <Badge variant={"squad"}>Admin</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{squad.handle}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {squad.membersCount} members
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {squads.length > 0 && (
        <Button className="mt-4 w-full" variant="outline">
          Show All Squads
        </Button>
      )}
    </div>
  );
}
