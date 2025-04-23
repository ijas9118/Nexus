import { Card, CardContent } from "@/components/molecules/card";
import { Users, Calendar, Star, MessageCircleMore } from "lucide-react";

type MentorStatsProps = {
  stats: {
    totalMentees: number;
    sessionsTaken: number;
    rating: number;
    reviewCount: number;
  };
};

export function MentorStats({ stats }: MentorStatsProps) {
  return (
    <div className="flex gap-3 flex-wrap items-center">
      <Card className="w-fit p-4 flex-1">
        <CardContent className="flex items-center gap-4 justify-center h-full p-0">
          <Users size={20} />
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold">{stats.totalMentees}</h3>
            <p className="text-sm text-muted-foreground">Mentees</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-fit p-4 flex-1">
        <CardContent className="flex items-center gap-4 justify-center h-full p-0">
          <Calendar size={20} />
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold">{stats.sessionsTaken}</h3>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-fit p-4 flex-1">
        <CardContent className="flex items-center gap-4 justify-center h-full p-0">
          <Star size={20} />
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold">{stats.rating}</h3>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-fit p-4 flex-1">
        <CardContent className="flex items-center gap-4 justify-center h-full p-0">
          <MessageCircleMore size={20} />
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold">{stats.reviewCount}</h3>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
