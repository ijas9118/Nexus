import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Star, Trophy, Users } from "lucide-react";

export default function StatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          Your Stats
        </CardTitle>
        <CardDescription>Track your progress and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Star className="h-4 w-4 text-amber-400" /> Nexus Points
          </div>
          <div className="font-bold">1,250</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Users className="h-4 w-4 text-blue-500" /> Squads Joined
          </div>
          <div className="font-bold">3</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Trophy className="h-4 w-4 text-amber-500" /> Competitions
          </div>
          <div className="font-bold">2</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">
          View All Stats
        </Button>
      </CardFooter>
    </Card>
  );
}
