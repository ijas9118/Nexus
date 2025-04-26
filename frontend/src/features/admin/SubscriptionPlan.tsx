import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { Dialog, DialogTrigger } from "@/components/organisms/dialog";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import PriceCard from "./subscription-plan/PricingCard";
import { FireIcon, FlameIcon, SparkIcon } from "@/components/icons/PlanIcons";
import PricingPlanForm from "./subscription-plan/PricingPlanForm";

const SubscriptionPlan = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription plan offerings
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Plan
              </Button>
            </DialogTrigger>
            <PricingPlanForm onClose={() => setIsDialogOpen(false)} />
          </Dialog>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <PriceCard
          tier="Spark"
          description="Begin your legend. One spark starts the fire."
          price="₹99"
          interval="month"
          ctaText="Light the Spark"
          logo={<SparkIcon />}
          highlights={[
            "Full access to premium blogs and exclusive videos",
            "Create your own premium content and share your genius",
            "Join premium squads — find your tribe, sharpen your craft",
            "Participate in monthly competitions and earn Nexus Points",
            "Top 5 scorers win real cash rewards every month",
          ]}
          isAdminView={true}
          onEdit={() => {
            setIsDialogOpen(true);
          }}
          onDelete={() => {
            // Handle delete logic here
            console.log("Deleting Spark plan...");
          }}
        />

        {/* Pro Plan */}
        <PriceCard
          tier="Flame"
          description="Grow the flame, burn brighter with every step."
          price="₹499"
          interval="6 months"
          ctaText="Fuel the Flame"
          logo={<FlameIcon />}
          isAdminView={true}
          highlights={[
            "Everything in Starter — but locked in for a full 6 months at a killer deal",
            "Bonus: Extra 5% Nexus Points boost in competitions",
            "Exclusive invites to secret squad events and content jams",
          ]}
          featured={true}
          onEdit={() => {
            setIsDialogOpen(true);
          }}
          onDelete={() => {
            // Handle delete logic here
            console.log("Deleting Spark plan...");
          }}
        />

        {/* Enterprise Plan */}
        <PriceCard
          tier="Fire"
          description="Shape destiny with unstoppable fire."
          price="₹899"
          interval="yearly"
          ctaText="Command the Fire"
          logo={<FireIcon />}
          isAdminView={true}
          highlights={[
            "All Starter and Ascend benefits, supercharged",
            "Bonus: Extra 10% Nexus Points boost every month",
            "Priority listing in squads and competitions",
            "Special badge: “Nexus Founder” on your profile",
            "Annual Grand Draw Entry (big prizes, real hype)",
          ]}
          onEdit={() => {
            setIsDialogOpen(true);
          }}
          onDelete={() => {
            // Handle delete logic here
            console.log("Deleting Spark plan...");
          }}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlan;
