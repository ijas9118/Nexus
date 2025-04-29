import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Button } from "@/components/atoms/button";
import PlanService from "@/services/planService";
import { IPlan } from "@/types/plans";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import PriceCard from "@/components/organisms/PricingCard";
import { getPlanLogo } from "@/utils/planLogo";

export default function UpgradePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<IPlan[]>({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would typically navigate to checkout or confirm the selection
    console.log(`Selected plan: ${planId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading subscription plans...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load subscription plans. Please try again later or contact
            support.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Upgrade Your Experience
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your journey. Elevate your experience and
          unlock new possibilities.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {plans?.map((plan) => (
          <motion.div
            key={plan._id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex"
          >
            <PriceCard
              tier={plan.tier}
              description={plan.description}
              price={`$${plan.price}`}
              interval={plan.interval}
              ctaText={plan.ctaText}
              highlights={plan.highlights}
              featured={plan.featured}
              logo={getPlanLogo(plan.logo)}
              isAdminView={false}
              onCTAClick={() => handlePlanSelect(plan._id as string)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <h3 className="text-lg font-medium mb-2">Need help choosing?</h3>
        <p className="text-muted-foreground mb-4">
          Our team is ready to help you find the perfect plan for your needs.
        </p>
        <Button variant="outline">Contact Support</Button>
      </motion.div>
    </div>
  );
}
