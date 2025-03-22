import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Hero from "./components/Hero";
import Benifits from "./components/Benifits";
import PricingPlanCards from "./components/PricingPlanCards";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";

export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-20">
      <Hero />

      <Benifits />

      <PricingPlanCards />

      <Testimonials />

      <FAQ />

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Elevate Your Tech Journey?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of developers who have accelerated their careers with
          Nexus Premium.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Get Premium Now
          </Button>
          <Link to="/mentors">
            <Button size="lg" variant="outline">
              Browse Mentors
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          No long-term commitment. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
