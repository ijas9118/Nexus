import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Sparkles, CalendarClock, LifeBuoy } from "lucide-react";

export default function MembershipBenefits({
  tier,
  benefits,
}: {
  tier: string;
  benefits: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" />
          {tier} Membership Benefits
        </CardTitle>
        <CardDescription>
          Enjoy these exclusive benefits with your current plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border"
            >
              <Sparkles className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="font-medium">{b}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4" /> Need Help?
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" /> View Events
        </Button>
      </CardFooter>
    </Card>
  );
}
