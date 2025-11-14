import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { Dialog, DialogTrigger } from "@/components/organisms/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import PriceCard from "../../components/organisms/PricingCard";
import PricingPlanForm from "./subscription-plan/PricingPlanForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlanService from "@/services/planService";
import { IPlan } from "@/types/plans";
import { getPlanLogo } from "@/utils/planLogo";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

const SubscriptionPlan = () => {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);

  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PlanService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] }); // Refresh list
    },
    onError: (error: any) => {
      console.error("Delete Error:", error);
      alert(error?.message || "Failed to delete plan");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return <div>Error: {errorMessage}</div>;
  }

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
            <PricingPlanForm
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedPlan(null);
              }}
              initialData={selectedPlan}
            />
          </Dialog>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans?.map((plan: IPlan) => (
          <PriceCard
            key={plan._id}
            tier={plan.tier}
            description={plan.description}
            price={`₹${plan.price}`}
            interval={plan.interval}
            ctaText={plan.ctaText}
            logo={getPlanLogo(plan.logo)}
            highlights={plan.highlights}
            isAdminView={true}
            featured={plan.featured}
            onEdit={() => {
              setSelectedPlan(plan);
              setIsDialogOpen(true);
            }}
            onDelete={
              <ConfirmDialog
                triggerLabel="Delete"
                triggerVariant="destructive"
                title="Delete this plan?"
                description={`This will permanently delete the "${plan.tier}" plan.`}
                confirmLabel="Delete"
                onConfirm={() => handleDelete(plan._id as string)}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
