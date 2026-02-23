import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/form";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Checkbox } from "@/components/atoms/checkbox";
import type { NotificationTypeData } from "@/types/notification";
import { isValidLucideIcon } from "@/utils/icon-utils";
import { DynamicIcon } from "./dynamic-icon";
import { HexColorPicker } from "react-colorful";

const roles = [
  { id: "admin", label: "Admin" },
  { id: "mentor", label: "Mentor" },
  { id: "premium", label: "Premium User" },
  { id: "user", label: "Normal User" },
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  icon: z
    .string()
    .min(1, "Icon name is required")
    .refine((val) => isValidLucideIcon(val), {
      message: "This icon doesn't exist in Lucide icons library.",
    }),
  iconColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, {
    message: "Must be a valid hex color code (e.g., #FF0000).",
  }),
  roles: z.array(z.string()).min(1, "Select at least one role."),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationTypeFormProps {
  initialData?: NotificationTypeData;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function NotificationTypeForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: NotificationTypeFormProps) {
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialData?.icon || null,
  );
  const [iconColor, setIconColor] = useState<string>(
    initialData?.iconColor || "#000000",
  );
  const [iconValid, setIconValid] = useState<boolean>(!!initialData?.icon);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      iconColor: "#000000",
      roles: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon,
        iconColor: initialData.iconColor,
        roles: initialData.roles,
      });
      setIconPreview(initialData.icon);
      setIconColor(initialData.iconColor);
      setIconValid(true);
    } else {
      form.reset({
        name: "",
        description: "",
        icon: "",
        iconColor: "#000000",
        roles: [],
      });
      setIconPreview(null);
      setIconColor("#000000");
      setIconValid(false);
    }
  }, [initialData, form]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIconChange = async (value: string) => {
    const valid = await isValidLucideIcon(value);
    setIconValid(valid);
    if (valid) {
      setIconPreview(value);
    }
  };

  const handleColorChange = (value: string) => {
    setIconColor(value);
    form.setValue("iconColor", value, { shouldValidate: true });
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast.success(
        isEditing
          ? "Notification type updated successfully"
          : "Notification type created successfully",
      );
    } catch (error: any) {
      console.error("Failed to save notification type:", error);
      const errorMessage = error?.message || "Failed to save notification type";

      if (errorMessage.toLowerCase().includes("already exists")) {
        form.setError("name", {
          type: "manual",
          message: "A notification type with this name already exists.",
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Message" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive name for this notification type.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notification sent when a user receives a new message"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain when this notification will be sent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Roles</FormLabel>
                    <FormDescription>
                      Select which user roles will receive this notification.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <FormItem
                            key={role.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, role.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== role.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {role.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MessageSquare"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleIconChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the exact name of a Lucide icon (e.g., MessageSquare,
                    Bell, AlertTriangle).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Color</FormLabel>
                  <div className="flex space-x-2 relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="#000000"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleColorChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div
                      className="h-10 w-10 rounded border cursor-pointer"
                      style={{ backgroundColor: iconColor }}
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      aria-label="Open color picker"
                    />
                    {isColorPickerOpen && (
                      <div
                        ref={colorPickerRef}
                        className="absolute z-10 top-12 right-0"
                      >
                        <HexColorPicker
                          color={iconColor}
                          onChange={handleColorChange}
                          className="shadow-lg border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Click the square to pick a color or enter a hex color code
                    (e.g., #FF0000 for red).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3">Icon Preview</h3>
              <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                {iconValid && iconPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="h-16 w-16 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: `${iconColor}20` }}
                    >
                      <DynamicIcon
                        name={iconPreview}
                        color={iconColor}
                        size={32}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {iconPreview}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Enter a valid Lucide icon name to see preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} Notification Type
          </Button>
        </div>
      </form>
    </Form>
  );
}
