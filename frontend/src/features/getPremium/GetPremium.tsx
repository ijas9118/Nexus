import { Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Link } from "react-router-dom";
import Hero from "./components/Hero";
import Benifits from "./components/Benifits";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import { useQuery } from "@tanstack/react-query";
import PlanService from "@/services/planService";
import { IPlan } from "@/types/plans";
import PriceCard from "../../components/organisms/PricingCard";
import { getPlanLogo } from "@/utils/planLogo";

export default function PremiumPage() {
  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<IPlan[]>({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-20">
      <Hero />

      <Benifits />

      <div>
        <h2 className="text-3xl font-bold text-center mb-4">
          Choose Your Plan
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Select the plan that works best for you. Upgrade, downgrade, or cancel
          anytime.
        </p>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Something went wrong. Probably the server had a bad day.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <PriceCard
                key={plan._id}
                tier={plan.tier}
                description={plan.description}
                price={`₹${plan.price}`}
                interval={plan.interval}
                ctaText={plan.ctaText}
                highlights={plan.highlights || []}
                featured={plan.featured || false}
                logo={getPlanLogo(plan.logo)}
                isAdminView={false}
              />
            ))}
          </div>
        )}
      </div>

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
