import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

const PricingPlanCards = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Select the plan that works best for you. Upgrade, downgrade, or cancel
        anytime.
      </p>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <Card className="border-primary/20 max-w-sm flex flex-col">
          <CardHeader>
            <CardTitle>Premium Monthly</CardTitle>
            <div className="mt-4 mb-2">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
            <CardDescription>
              Perfect for individuals looking to enhance their tech journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Access to all premium blogs</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Join premium squads</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Book mentorship sessions (at regular rates)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Priority support</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button variant="outline" className="w-full">
              Subscribe Monthly
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary/20 max-w-sm flex flex-col">
          <CardHeader>
            <Badge className=" mb-2 w-fit">BEST VALUE</Badge>
            <CardTitle>Premium Yearly</CardTitle>
            <div className="mt-4 mb-2">
              <span className="text-4xl font-bold">$95.88</span>
              <span className="text-muted-foreground ml-2">/year</span>
              <div className="text-sm text-muted-foreground mt-1">
                <s>$119.88</s> Save $24 (20%)
              </div>
            </div>
            <CardDescription>
              Best value with 2 free mentorship sessions included.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>All features in monthly plan</span>
              </div>
              <div className="flex items-center font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>2 FREE mentorship sessions (save $150+)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>20% discount on additional mentorship sessions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Early access to new features</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="relative z-10">
            <Button className="w-full" size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Subscribe & Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPlanCards;
