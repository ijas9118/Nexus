import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/form";
import { Check, ImageIcon, Video } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./BlogCreationForm";

interface ContentTypeSelectorProps {
  form: UseFormReturn<FormValues>;
}

const ContentTypeSelector = ({ form }: ContentTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Content Type</FormLabel>
            <FormDescription>
              Choose the type of content you want to create
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  field.value === "blog"
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/20"
                }`}
                onClick={() => field.onChange("blog")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      field.value === "blog"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {field.value === "blog" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Blog Post</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a written article with rich text formatting
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  field.value === "video"
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/20"
                }`}
                onClick={() => field.onChange("video")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      field.value === "video"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {field.value === "video" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Video className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Video Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload and share video content with your audience
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContentTypeSelector;
