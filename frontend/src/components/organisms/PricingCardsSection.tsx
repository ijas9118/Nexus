import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Check } from "lucide-react";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Get Premium", url: "" },
      ]),
    );
  }, [dispatch]);

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
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-700 text-white   text-sm rounded-full">
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
                  <span className="block text-sm text-green-600 dark:text-green-300 mt-1">
                    {plan.saving}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 dark:text-green-700 shrink-0 mt-0.5" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className={`w-full `}>Get Started</Button>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PricingCardsSection;
