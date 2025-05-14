import { Progress } from "@/components/molecules/progress";
import { MentorshipType } from "../types";

interface MentorshipProgressProps {
  mentorshipTypes: MentorshipType[];
}

export function MentorshipProgress({
  mentorshipTypes,
}: MentorshipProgressProps) {
  return (
    <div className="space-y-4">
      {mentorshipTypes.map((type) => (
        <div key={type.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{type.name}</div>
            <div className="text-sm text-muted-foreground">
              {type.bookings} sessions
            </div>
          </div>
          <Progress value={type.percentage} className="h-2" />
        </div>
      ))}
    </div>
  );
}
