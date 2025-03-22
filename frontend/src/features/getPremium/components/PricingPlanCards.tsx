import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import PaymentService from "@/services/paymentService";
import PlanService from "@/services/planService";
import { IPlan } from "@/types/plans";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PricingPlanCards = () => {
  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<IPlan[]>({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });

  if (isLoading) {
    return <p className="text-center">Loading plans...</p>;
  }

  if (isError || !plans) {
    return <p className="text-center text-red-500">Failed to load plans.</p>;
  }

  const checkout = async (plan: IPlan) => {
    try {
      const sessionUrl = await PaymentService.createSession(plan);

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        throw new Error("Failed to retrieve checkout session URL.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Oops!", {
        description: error.message || "An error occurred during checkout.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Select the plan that works best for you. Upgrade, downgrade, or cancel
        anytime.
      </p>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {plans.map((plan, index) => (
          <Card
            className="border-primary/20 max-w-sm flex flex-col"
            key={index}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  {plan.name}
                  {plan.interval === "yearly" && (
                    <Badge className=" mb-2 w-fit">BEST VALUE</Badge>
                  )}
                </div>
              </CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-2">
                  /{plan.interval}
                </span>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              {plan?.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                variant={plan.interval === "yearly" ? "default" : "secondary"}
                className="w-full"
                onClick={() => checkout(plan)}
              >
                {plan.interval === "yearly" && <Sparkles />}
                {plan.interval === "monthly"
                  ? "Subscribe Monthly"
                  : "Subscribe & Save"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlanCards;
