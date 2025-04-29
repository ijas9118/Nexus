import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import { Progress } from "@/components/molecules/progress";
import { Button } from "@/components/atoms/button";
import { ISubscriptionWithPlan } from "@/types/subscription";
import dayjs from "dayjs";
import { getPlanLogo } from "@/utils/planLogo";
import { Link } from "react-router-dom";

export default function MembershipCard({
  subscription,
}: {
  subscription: ISubscriptionWithPlan;
}) {
  const start = dayjs(subscription?.startDate);
  const end = dayjs(subscription?.endDate);
  const today = dayjs();

  const totalDays = end.diff(start, "day");
  const remainingDays = end.diff(today, "day");
  const usedDays = totalDays - remainingDays;
  console.log(totalDays, remainingDays, usedDays);
  const progressPercent = Math.min(
    100,
    Math.max(0, (usedDays / totalDays) * 100),
  );

  const planLogo = getPlanLogo(subscription?.planId?.logo, "h-6 w-6");

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Membership Status
        </CardTitle>
        <CardDescription>
          Your current membership details and status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:[grid-template-columns:2fr_1fr] gap-2">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="flex items-center gap-2">
              {planLogo}
              <div className="text-xl font-bold">{subscription?.tier}</div>
              <Badge variant="secondary" className="text-xs">
                ₹{subscription?.planId.price}/{subscription?.planId.interval}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${subscription?.status === "active" ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <div className="font-medium capitalize">
                {subscription?.status}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Membership Period
            </div>
            <div className="text-sm font-medium">
              {remainingDays > 0
                ? `${remainingDays} of ${subscription?.planId.durationInDays} days remaining`
                : `Expired (0 out of ${subscription?.planId.durationInDays} days)`}
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              Started: {start.isValid() ? start.format("MMM D, YYYY") : "N/A"}
            </div>
            <div>
              Expires: {end.isValid() ? end.format("MMM D, YYYY") : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link to={"/premium/upgrade"}>
          <Button className="w-full sm:w-auto">Upgrade Your Plan</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
