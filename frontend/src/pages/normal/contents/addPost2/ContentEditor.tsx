import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { TipTapEditor } from "./TipTapEditor";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./BlogCreationForm";

interface ContentEditorProps {
  form: UseFormReturn<FormValues>;
  contentType: string;
  videoPreview: string | null;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  form,
  contentType,
  videoPreview,
  handleVideoChange,
}) => {
  return (
    <div className="space-y-4">
      {contentType === "blog" ? (
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Content</FormLabel>
              <FormControl>
                <TipTapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Write your blog post with rich formatting options
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="videoFile"
          render={({ field: { value: _value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Video Upload</FormLabel>
              <FormControl>
                <div className="grid gap-4">
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors">
                    <Input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="video-upload"
                      onChange={(e) => {
                        onChange(e.target.files?.[0] || null);
                        handleVideoChange(e);
                      }}
                      {...field}
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className="rounded-full bg-muted p-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Click to upload video</p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM or MOV (max. 1GB)
                        </p>
                      </div>
                    </label>
                  </div>
                  {videoPreview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload your video file to share with your audience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {contentType === "video" && (
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Description</FormLabel>
              <FormControl>
                <TipTapEditor content={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Add a description for your video
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ContentEditor;
