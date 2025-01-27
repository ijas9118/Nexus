import PricingCardsSection from "@/components/normal/home/PricingCardsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Star, Users } from "lucide-react";
import { FC } from "react";
import { plans } from "./Home";


const features = [
  {
    icon: BookOpen,
    title: "Exclusive Content",
    description: "Access premium blogs, videos, and insights from top mentors",
    iconColor: "text-purple-500",
  },
  {
    icon: Users,
    title: "Premium Squads",
    description: "Join exclusive squads for advanced discussions and collaboration",
    iconColor: "text-blue-500",
  },
  {
    icon: Star,
    title: "Mentor Sessions",
    description: "Book time with industry experts for one-on-one guidance",
    iconColor: "text-purple-500",
  },
];

const GetPremium: FC = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 max-w-3xl text-foreground">
          Unlock Your Full Potential with Premium Access
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Exclusive content, advanced features, and more—tailored for professionals who
          want to stay ahead.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 text-md rounded-md">
          Choose Your Plan
        </Button>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-3xl md:text-4xl text-center mb-16 text-foreground">
          Why Go Premium?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center text-center p-8">
                <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-6`} />
                <h3 className="text-xl font-medium mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-16 text-foreground">
          Choose a Plan That Works for You
        </h2>
        <PricingCardsSection plans={plans} />
      </section>
    </>
  );
};

export default GetPremium;
