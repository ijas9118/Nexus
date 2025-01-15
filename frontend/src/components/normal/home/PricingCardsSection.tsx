import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  saving?: string;
  features: string[];
  popular?: boolean;
}

interface PricingCardsSectionProps {
  plans: Plan[];
}

const PricingCardsSection: React.FC<PricingCardsSectionProps> = ({ plans }) => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {plans.map((plan, index) => (
        <Card
          key={index}
          className={`relative ${
            plan.popular
              ? "border-2 border-blue-700 shadow-lg"
              : "border-gray-200"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-700 text-white text-sm rounded-full">
              Popular
            </span>
          )}
          <div className="flex flex-col justify-between h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
                {plan.saving && (
                  <span className="block text-sm text-green-600 mt-1">
                    {plan.saving}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-indigo-700 hover:bg-indigo-900"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                Get Started
              </Button>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PricingCardsSection;
