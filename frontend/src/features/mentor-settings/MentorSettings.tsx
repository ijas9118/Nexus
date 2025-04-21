import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import { Form } from "@/components/organisms/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { formSchema } from "./schema";
import { ExperienceTab } from "./components/experience-tab";
import { MentorshipTab } from "./components/mentorship-tab";

export default function MentorSettingsPage() {
  // Initialize form with default values from the provided data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      experience: {
        currentRole: "SDE II",
        company: "Acme inc",
        experienceLevel: "5-10",
        expertiseAreas: ["frontend", "backend"],
        technologies: ["react"],
        bio: "asdadsf",
      },
      mentorshipDetails: {
        mentorshipTypes: ["one-on-one", "interview-prep"],
        targetAudiences: ["junior-developers"],
        availabilityType: "weekend",
        motivation: "asdff",
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Mentor Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your professional information and mentorship preferences
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experience">
                Professional Experience
              </TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship Details</TabsTrigger>
            </TabsList>

            {/* Professional Experience Tab */}
            <TabsContent value="experience" className="space-y-6 pt-4">
              <ExperienceTab control={form.control} />
            </TabsContent>

            {/* Mentorship Details Tab */}
            <TabsContent value="mentorship" className="space-y-6 pt-4">
              <MentorshipTab control={form.control} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
