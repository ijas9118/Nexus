// AddPlanForm.tsx
import { useState } from "react";
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
  const [features, setFeatures] = useState([""]);
  const iconOptions = [
    { name: "Sparkles", component: SparkIcon },
    { name: "Flame", component: FlameIcon },
    { name: "Fire", component: FireIcon },
  ];

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.name} value={option.name}>
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
              <Input id="name" name="name" placeholder="e.g. Growth Plan" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" placeholder="79.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="eg. For professional teams and businesses"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingInterval">Billing Interval</Label>
              <Input
                id="billingInterval"
                name="billingInterval"
                placeholder="/month"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                name="buttonText"
                placeholder="Upgrade Plan"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="featured" />
            <Label htmlFor="featured">Featured Plan</Label>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div className="w-1/2 space-y-2" variants={itemVariants}>
          <Label className="mb-2 block">Features</Label>
          <div className="border rounded-md h-80 flex flex-col">
            <ScrollArea className="flex-grow p-4">
              <motion.div className="space-y-3" variants={containerVariants}>
                {features.map((feature, index) => (
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
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button>Save Plan</Button>
        </motion.div>
      </DialogFooter>
    </DialogContent>
  );
};

export default PricingPlanForm;
