import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Info, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="text-center mb-16">
      <Badge className="mb-6 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-800/40 dark:text-amber-500 hover:dark:bg-amber-800">
        <Crown className="h-3.5 w-3.5 mr-1" />
        Premium Membership
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Unlock the Full Nexus Experience
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto ">
        Gain access to exclusive content, premium squads, and mentorship
        opportunities to accelerate your tech journey.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Button size="lg" className="gap-2">
          <Sparkles />
          Get Premium Now
        </Button>
        <Button size="lg" variant="outline">
          <Info />
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default Hero;
