"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ContentPreview } from "./ContentPreview";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import ContentTypeSelector from "./ContentTypeSelector";
import BasicDetailsForm from "./BasicDetailsForm";
import ContentEditor from "./ContentEditor";
import ContentSummary from "./ContentSummary";

const formSchema = z.object({
  contentType: z.enum(["blog", "video"]),
  squad: z.string().min(1, "Please select a squad"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  thumbnail: z.any().optional(),
  videoFile: z.any().optional(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    alert("Content submitted successfully!");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

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
                    <Button type="button" onClick={nextStep}>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">Publish Content</Button>
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
          isPremium
          content={content}
        />
      </div>
    </div>
  );
}
