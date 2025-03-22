import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Link } from "react-router-dom";

const MentorBooking = ({ mentor, id }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Session</CardTitle>
        <CardDescription>Schedule time with {mentor.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentor.pricing.map((option: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium">{option.type}</p>
              <p className="text-sm text-muted-foreground">
                ${option.price} per session
              </p>
            </div>
            <Link
              to={`/mentors/${id}/book?type=${encodeURIComponent(option.type)}`}
            >
              <Button size="sm">Book</Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MentorBooking;
