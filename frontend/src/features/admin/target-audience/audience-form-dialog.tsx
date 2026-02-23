import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/form";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Switch } from "@/components/atoms/switch";
import { TargetAudience } from "@/types/mentor";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AudienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  audience?: TargetAudience | null;
  mode: "create" | "edit";
}

export function AudienceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  audience,
  mode,
}: AudienceFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (audience && mode === "edit") {
        form.reset({
          name: audience.name,
          isActive: audience.isActive,
        });
      } else {
        form.reset({
          name: "",
          isActive: true,
        });
      }
    }
  }, [audience, mode, open, form]);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
      toast.success(
        mode === "create"
          ? "Target audience created successfully"
          : "Target audience updated successfully",
      );
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save target audience:", error);
      const errorMessage = error?.message || "Failed to save target audience";

      if (errorMessage.toLowerCase().includes("already exists")) {
        form.setError("name", {
          type: "manual",
          message: "Target audience with this name already exists.",
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "create" ? "Create Target Audience" : "Edit Target Audience";
  const description =
    mode === "create"
      ? "Add a new target audience segment for your campaigns."
      : "Update the details of your target audience segment.";
  const buttonText = mode === "create" ? "Create Audience" : "Update Audience";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-sans">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter audience name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
