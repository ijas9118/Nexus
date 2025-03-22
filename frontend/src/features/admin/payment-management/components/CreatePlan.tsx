import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import { DialogProps } from "@/types/dialog";
import { toast } from "sonner";
import PlanService from "@/services/planService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { useState } from "react";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be greater than 0"),
  interval: z.enum(["monthly", "yearly"], {
    errorMap: () => ({ message: "Interval must be either monthly or yearly" }),
  }),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePlan({ open, onOpenChange }: DialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      interval: "monthly",
      description: "",
    },
  });
  const [features, setFeatures] = useState<string[]>([""]);

  const onSubmit = async (data: FormData) => {
    try {
      await PlanService.createPlan({
        name: data.name,
        price: data.price,
        interval: data.interval,
        description: data.description,
        features: features.filter((feature) => feature.trim() !== ""),
      });

      toast("Plan Created", {
        description: `A new plan has been created successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating plan", error);
      toast.error("Error", {
        description: "Failed to create plan. Please try again.",
      });
    }
  };

  const addFeatureInput = () => {
    setFeatures([...features, ""]);
  };

  // Function to update a feature value
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>Enter plan details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Enter plan name"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="price"
                        type="number"
                        placeholder="Enter plan price"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : "",
                          )
                        }
                      />
                    )}
                  />

                  {errors.price && (
                    <p className="text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="interval" className="text-right">
                  Interval
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.interval && (
                    <p className="text-sm text-red-600">
                      {errors.interval.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="description"
                        placeholder="Enter plan description"
                        {...field}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Features
                </Label>
                <div className="col-span-3 space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        id={`feature-${index}`}
                        placeholder="Enter feature"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                      />
                      {index === features.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addFeatureInput}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
