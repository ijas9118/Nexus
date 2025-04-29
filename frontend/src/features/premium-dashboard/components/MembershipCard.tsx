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

export default function MembershipCard({
  subscription,
}: {
  subscription: any;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" />
          Membership Status
        </CardTitle>
        <CardDescription>
          Your current membership details and status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold">{subscription?.tier}</div>
              <Badge variant="secondary" className="text-xs">
                ${subscription?.planId.price}/{subscription?.planId.interval}
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
            <div className="text-sm font-medium">12 days remaining</div>
          </div>
          <Progress value={56} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              Started:{" "}
              {subscription?.startDate
                ? format(new Date(subscription.startDate), "MMM d, yyyy")
                : "N/A"}
            </div>
            <div>
              Expires:{" "}
              {subscription?.endDate
                ? format(new Date(subscription.endDate), "MMM d, yyyy")
                : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button className="w-full sm:w-auto">Renew Membership</Button>
        <Button className="w-full sm:w-auto" variant="outline">
          Cancel Membership
        </Button>
      </CardFooter>
    </Card>
  );
}
