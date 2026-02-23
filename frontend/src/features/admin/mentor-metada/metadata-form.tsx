import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/organisms/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import type { MentorMetadataData } from "@/services/mentorMetadataService";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(50, "Label must not exceed 50 characters"),
  type: z.enum(["experienceLevel", "expertiseArea", "technology"], {
    required_error: "Type is required",
  }),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface MetadataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MentorMetadataData>) => Promise<void>;
  initialData: MentorMetadataData | null;
}

export default function MetadataForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: MetadataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      label: "",
      type: "experienceLevel",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          label: initialData.label,
          type: initialData.type,
          isActive: initialData.isActive,
        });
      } else {
        form.reset({
          name: "",
          label: "",
          type: "experienceLevel",
          isActive: true,
        });
      }
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast.success(
        initialData
          ? "Metadata updated successfully"
          : "Metadata created successfully",
      );
      onClose();
    } catch (error: any) {
      console.error("Failed to save metadata:", error);
      const errorMessage = error?.message || "Failed to save metadata";

      if (errorMessage.toLowerCase().includes("already exists")) {
        form.setError("name", {
          type: "manual",
          message: "Metadata with this name or label already exists.",
        });
        form.setError("label", {
          type: "manual",
          message: "Metadata with this name or label already exists.",
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialData ? "Edit Metadata" : "Add New Metadata"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Display label (e.g. 'beginner')"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Internal name (e.g. 'Beginner')"
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="experienceLevel">
                        Experience Level
                      </SelectItem>
                      <SelectItem value="expertiseArea">
                        Expertise Area
                      </SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
