import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import PricingCard from "./subscription-plan/PricingCard";
import { PlanForm } from "./subscription-plan/PricingForm";

const SubscriptionPlan = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Starter Plan",
      price: "29.00",
      interval: "/month",
      features: [
        "Manage up to 1,000 contacts",
        "Basic customer management",
        "Limited automation features",
        "Standard reporting",
      ],
      buttonText: "Get Started",
      featured: false,
    },
    {
      id: 2,
      name: "Growth Plan",
      price: "79.00",
      interval: "/month",
      features: [
        "Manage up to 10,000 contacts",
        "Advanced customer management",
        "Full workflow automation",
        "Real-time reporting and analytics",
        "Collaborative team features",
      ],
      buttonText: "Upgrade Plan",
      featured: true,
      badge: "PRO",
    },

    {
      id: 3,
      name: "Enterprise Plan",
      price: "199.00",
      interval: "/month",
      features: [
        "Unlimited contacts",
        "Premium customer management",
        "Advanced automation workflows",
        "Custom reporting and analytics",
        "Dedicated support team",
        "API access",
      ],
      buttonText: "Contact Sales",
      featured: true,
      badge: "ENTERPRISE",
    },
  ]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      // Edit existing plan
      setPlans(plans.map((p) => (p.id === planData.id ? planData : p)));
    } else {
      // Add new plan
      setPlans([...plans, planData]);
    }
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan: any) => {
    console.log("========");
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (planId: any) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setPlans(plans.filter((p) => p.id !== planToDelete));
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };
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
              <Button onClick={() => setEditingPlan(null)}>
                <Plus className="h-4 w-4 mr-2" /> Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPlan ? "Edit Plan" : "Create New Plan"}
                </DialogTitle>
                <DialogDescription>
                  {editingPlan
                    ? "Update the details of your existing plan."
                    : "Fill in the details to create a new pricing plan."}
                </DialogDescription>
              </DialogHeader>
              <PlanForm
                plan={editingPlan}
                onSave={handleSavePlan}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected pricing plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionPlan;
