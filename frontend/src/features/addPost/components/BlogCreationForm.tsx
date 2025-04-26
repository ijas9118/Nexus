import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
import { ContentPreview } from "./ContentPreview";
import { Progress } from "@/components/molecules/progress";
import { Form } from "@/components/organisms/form";
import ContentEditor from "./ContentEditor";
import ContentSummary from "./ContentSummary";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ContentTypeSelector from "./ContentTypeSelector";
import BasicDetailsForm from "./BasicDetailsForm";
import { useAddPost } from "../hooks/useAddPost";

const formSchema = z.object({
  contentType: z.enum(["blog", "video"]),
  squad: z.string().min(1, "Please select a squad"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  thumbnail: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Invalid thumbnail file",
    )
    .optional(),
  videoFile: z
    .custom<FileList>((val) => val instanceof FileList, "Invalid video file")
    .optional(),
  isPremium: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: "type", name: "Content Type" },
  { id: "details", name: "Basic Details" },
  { id: "content", name: "Content" },
  { id: "preview", name: "Preview" },
];

export function BlogCreationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const squads = useSelector((state: RootState) => state.userSquads.squads);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      contentType: "blog",
      squad: "",
      title: "",
      content: "",
      isPremium: false,
    },
  });

  const contentType = form.watch("contentType");
  const title = form.watch("title");
  const content = form.watch("content");
  const isPremium = form.watch("isPremium");

  const { submitPost, isSubmitting } = useAddPost();

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      setVideoPreview(null);
    }
  };

  const onSubmit = (data: FormValues) => {
    submitPost(data);
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const progress = ((currentStep + 1) / steps.length) * 100;

  const isStepValid = () => {
    const values = form.getValues();
    const errors = form.formState.errors;

    if (currentStep === 0) {
      return !!values.contentType && !errors.contentType;
    }

    if (currentStep === 1) {
      return !!values.squad && !!values.title && !errors.squad && !errors.title;
    }

    if (currentStep === 2) {
      if (values.contentType === "blog") {
        return !!values.content && !errors.content;
      } else {
        return !!values.videoFile && !errors.videoFile;
      }
    }

    return true;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
      <div className="lg:col-span-2">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">
                  Step {currentStep + 1}: {steps[currentStep].name}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {currentStep + 1} of {steps.length}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 0 && <ContentTypeSelector form={form} />}

                    {currentStep === 1 && (
                      <BasicDetailsForm
                        form={form}
                        thumbnailPreview={thumbnailPreview}
                        handleThumbnailChange={handleThumbnailChange}
                        squads={squads}
                        setThumbnailPreview={setThumbnailPreview}
                      />
                    )}

                    {currentStep === 2 && (
                      <ContentEditor
                        form={form}
                        contentType={contentType}
                        videoPreview={videoPreview}
                        handleVideoChange={handleVideoChange}
                      />
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="rounded-lg border overflow-hidden">
                          <div className="bg-muted p-4 border-b">
                            <h3 className="font-medium">Content Preview</h3>
                          </div>
                          <div className="p-4">
                            <ContentPreview
                              contentType={contentType}
                              title={title}
                              content={content}
                              thumbnailUrl={thumbnailPreview}
                              videoUrl={videoPreview}
                              isPremium={isPremium}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Back
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Publish Content"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:block">
        <ContentSummary
          contentType={contentType}
          title={title}
          thumbnailPreview={thumbnailPreview}
          isPremium={isPremium}
          content={content}
        />
      </div>
    </div>
  );
}
