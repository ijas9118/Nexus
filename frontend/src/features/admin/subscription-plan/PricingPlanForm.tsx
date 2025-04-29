// AddPlanForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Switch } from "@/components/atoms/switch";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { FireIcon, FlameIcon, SparkIcon } from "@/components/icons/PlanIcons";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlanService from "@/services/planService";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

interface PricingPlanFormProps {
  onClose: () => void;
}

const PricingPlanForm = ({ onClose }: PricingPlanFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    billingInterval: "",
    buttonText: "",
    icon: "",
    featured: false,
    features: [""],
  });

  const iconOptions = [
    { name: "Sparkles", component: SparkIcon, value: "spark" },
    { name: "Flame", component: FlameIcon, value: "flame" },
    { name: "Fire", component: FireIcon, value: "fire" },
  ];

  const calculateDurationInDays = (interval: string): number => {
    const match = interval
      .toLowerCase()
      .trim()
      .match(/^(\d+)?\s*(month|months)$/);
    if (!match) return 0;
    const numMonths = match[1] ? parseInt(match[1], 10) : 1;
    return numMonths * 30; // Same logic as backend
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch change for featured plan
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  // Handle icon selection
  const handleIconChange = (value: string) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  // Handle feature addition
  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  // Handle feature removal
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // Handle feature update
  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = value;
      return { ...prev, features: updatedFeatures };
    });
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name) return "Plan name is required";
    if (!formData.price || isNaN(Number(formData.price)))
      return "Valid price is required";
    if (!formData.description) return "Description is required";
    if (!formData.billingInterval) return "Billing interval is required";

    const intervalMatch = formData.billingInterval
      .toLowerCase()
      .trim()
      .match(/^(\d+)?\s*(month|months)$/);
    if (!intervalMatch)
      return "Invalid interval format. Use 'month' or '<number> months'";

    if (!formData.buttonText) return "Button text is required";
    if (!formData.icon) return "Plan icon is required";
    if (formData.features.some((f) => !f)) return "All features must be filled";
    return null;
  };

  // Mutation for creating a new plan
  const createPlanMutation = useMutation({
    mutationFn: () =>
      PlanService.createPlan({
        tier: formData.name,
        price: Number(formData.price),
        description: formData.description,
        interval: formData.billingInterval.replace("/", ""),
        ctaText: formData.buttonText,
        logo: formData.icon,
        highlights: formData.features,
        featured: formData.featured,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] }); // Invalidate plans cache
      toast.success("Success", {
        description: "Plan created successfully!",
      });
      onClose(); // Close the dialog
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create plan";
      toast.error("Error", {
        description: errorMessage,
      });
    },
  });

  // Handle form submission
  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error("Validation Error", {
        description: validationError,
      });
      return;
    }
    createPlanMutation.mutate();
  };

  return (
    <DialogContent className="sm:max-w-5xl p-0 overflow-hidden">
      <DialogHeader className="px-6 pt-6 pb-2">
        <DialogTitle>Create New Plan</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new pricing plan.
        </DialogDescription>
      </DialogHeader>

      <motion.div
        className="flex flex-row gap-6 p-6 pt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <motion.div className="w-1/2 space-y-4" variants={itemVariants}>
          <div className="space-y-2">
            <Label htmlFor="icon">Plan Icon</Label>
            <Select onValueChange={handleIconChange} value={formData.icon}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.component className="h-5 w-5" />
                      <span>{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Growth Plan"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                placeholder="79.00"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. For professional teams and businesses"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingInterval">Billing Interval</Label>
              <Input
                id="billingInterval"
                name="billingInterval"
                placeholder="/month"
                value={formData.billingInterval}
                onChange={handleInputChange}
              />
              {/* Display calculated days */}
              {formData.billingInterval && (
                <p className="text-sm text-muted-foreground">
                  Duration: {calculateDurationInDays(formData.billingInterval)}{" "}
                  days
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                name="buttonText"
                placeholder="Upgrade Plan"
                value={formData.buttonText}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Featured Plan</Label>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div className="w-1/2 space-y-2" variants={itemVariants}>
          <Label className="mb-2 block">Features</Label>
          <div className="border rounded-md h-80 flex flex-col">
            <ScrollArea className="flex-grow p-4">
              <motion.div className="space-y-3" variants={containerVariants}>
                {formData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      placeholder="Feature description"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFeature(index)}
                      className="hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollArea>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="w-full justify-center transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <DialogFooter className="px-6 py-4 border-t flex-row justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={createPlanMutation.isPending}
        >
          Cancel
        </Button>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleSubmit}
            disabled={createPlanMutation.isPending}
          >
            {createPlanMutation.isPending ? "Saving..." : "Save Plan"}
          </Button>
        </motion.div>
      </DialogFooter>
    </DialogContent>
  );
};

export default PricingPlanForm;
