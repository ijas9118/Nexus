import { Card } from "@/components/molecules/card";
import { Progress } from "@/components/molecules/progress";
import { Flame } from "lucide-react";

export default function ProfileReadingStreak() {
  const topTags = [
    { tag: "#webdev", value: 53 },
    { tag: "#react", value: 41 },
    { tag: "#javascript", value: 41 },
    { tag: "#devtools", value: 18 },
    { tag: "#career", value: 18 },
  ];

  return (
    <div className="space-y-6 py-4">
      <Card className="p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <Flame />
          Reading streak
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">
              Longest streak 🏆
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">17</div>
            <div className="text-sm text-muted-foreground">
              Total reading days
            </div>
          </div>
        </div>
      </Card>
      <div>
        <h3 className="mb-4 font-semibold">Top tags by reading days</h3>
        <div className="grid grid-cols-2 gap-6">
          {topTags.map(({ tag, value }) => (
            <div key={tag}>
              <div className="flex justify-between text-sm">
                <span>{tag}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value} className="mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
