import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageIcon } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./BlogCreationForm";

interface BasicDetailsFormProps {
  form: UseFormReturn<FormValues>;
  thumbnailPreview: string | null;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const squads = [
  { id: "engineering", name: "Engineering" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
  { id: "product", name: "Product" },
  { id: "sales", name: "Sales" },
];

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  form,
  thumbnailPreview,
  handleThumbnailChange,
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="squad"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Squad</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a squad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {squads.map((squad) => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The squad this content will be published under
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a compelling title" {...field} />
            </FormControl>
            <FormDescription>
              A clear, descriptive title helps your audience find your content
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="thumbnail"
        render={({ field: { value: _value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Thumbnail Image</FormLabel>
            <FormControl>
              <div className="grid gap-4">
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="thumbnail-upload"
                    onChange={(e) => {
                      onChange(e.target.files?.[0] || null);
                      handleThumbnailChange(e);
                    }}
                    {...field}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="rounded-full bg-muted p-2">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF (max. 2MB)
                      </p>
                    </div>
                  </label>
                </div>
                {thumbnailPreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              An eye-catching thumbnail will attract more viewers
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPremium"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Premium Content</FormLabel>
              <FormDescription>
                Make this content available only to premium subscribers
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicDetailsForm;
