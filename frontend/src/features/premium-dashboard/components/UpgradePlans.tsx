import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Flame, Rocket, Crown } from "lucide-react";

const plans = [
  {
    tier: "Blaze",
    price: 199,
    description: "Fan the flames. Turn your spark into a blaze.",
    icon: <Flame className="h-5 w-5 text-red-500" />,
  },
  {
    tier: "Inferno",
    price: 299,
    description: "Unleash the inferno. Become unstoppable.",
    icon: <Rocket className="h-5 w-5 text-purple-600" />,
  },
  {
    tier: "Legend",
    price: 499,
    description: "Ascend to legend status. Leave a legacy.",
    icon: <Crown className="h-5 w-5 text-amber-400" />,
  },
];

export default function UpgradePlans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" /> Upgrade Your Plan
        </CardTitle>
        <CardDescription>
          Explore other membership tiers and their benefits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className="border-2 hover:border-primary/50 transition-all"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {plan.icon}
                    <CardTitle className="text-lg">{plan.tier}</CardTitle>
                  </div>
                  <Badge variant="outline">${plan.price}/mo</Badge>
                </div>
                <CardDescription className="text-xs">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
