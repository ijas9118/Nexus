import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { MultiSelect } from "./multi-select";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/molecules/card";
import { toast } from "sonner";
import MentorMetadataService from "@/services/mentorMetadataService";

// Mock service for updating mentor
const updateMentorExperience = async (data: any) => {
  // This would be a real API call
  console.log("Updating mentor experience:", data);
  return data;
};

const experienceFormSchema = z.object({
  currentRole: z.string().min(2, {
    message: "Current role must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  experienceLevel: z.string({
    required_error: "Please select an experience level.",
  }),
  expertiseAreas: z.array(z.string()).min(1, {
    message: "Please select at least one expertise area.",
  }),
  technologies: z.array(z.string()).min(1, {
    message: "Please select at least one technology.",
  }),
  bio: z
    .string()
    .min(50, {
      message: "Bio must be at least 50 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  resume: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export default function ExperienceForm({ mentorData }: { mentorData: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch metadata
  const { data: experienceLevels = [] } = useQuery({
    queryKey: ["metadata", "experienceLevel"],
    queryFn: () => MentorMetadataService.getByType("experienceLevel"),
  });

  console.log(experienceLevels);

  const { data: expertiseAreas = [] } = useQuery({
    queryKey: ["metadata", "expertiseArea"],
    queryFn: () => MentorMetadataService.getByType("expertiseArea"),
  });

  const { data: technologies = [] } = useQuery({
    queryKey: ["metadata", "technology"],
    queryFn: () => MentorMetadataService.getByType("technology"),
  });

  // Set up mutation
  const mutation = useMutation({
    mutationFn: updateMentorExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorDetails"] });
      toast.success("Experience updated", {
        description:
          "Your professional experience has been updated successfully.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description:
          "There was an error updating your experience. Please try again.",
      });
    },
  });

  // Set up form with default values from mentor data
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      currentRole: mentorData?.experience?.currentRole || "",
      company: mentorData?.experience?.company || "",
      experienceLevel: mentorData?.experience?.experienceLevel?.id || "",
      expertiseAreas:
        mentorData?.experience?.expertiseAreas?.map((area: any) => area.id) ||
        [],
      technologies:
        mentorData?.experience?.technologies?.map((tech: any) => tech.id) || [],
      bio: mentorData?.experience?.bio || "",
      resume: mentorData?.experience?.resume || "",
    },
  });

  function onSubmit(values: ExperienceFormValues) {
    mutation.mutate(values);
  }

  const handleFileUpload = () => {
    setIsUploading(true);
    // Mock file upload
    setTimeout(() => {
      form.setValue("resume", "https://example.com/resume.pdf");
      setIsUploading(false);
      toast.success("Resume uploaded", {
        description: "Your resume has been uploaded successfully.",
      });
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="currentRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Role</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Software Engineer" {...field} />
                </FormControl>
                <FormDescription>
                  Your current job title or role.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>
                  The company you currently work for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceLevels.map((level: any) => (
                    <SelectItem key={level._id} value={level._id}>
                      <div className="flex gap-5">
                        <span>{level.label}</span>
                        <span>{level.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Your overall professional experience level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertiseAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Areas of Expertise</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={expertiseAreas.map((area: any) => ({
                    value: area._id,
                    label: area.name,
                  }))}
                  onChange={field.onChange}
                  placeholder="Select expertise areas"
                />
              </FormControl>
              <FormDescription>
                Select the areas where you have professional expertise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={technologies.map((tech: any) => ({
                    value: tech._id,
                    label: tech.name,
                  }))}
                  onChange={field.onChange}
                  placeholder="Select technologies"
                />
              </FormControl>
              <FormDescription>
                Select the technologies you are proficient in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your professional journey, achievements, and what you're passionate about..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write a brief professional bio that highlights your experience
                and expertise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume / CV</FormLabel>
              <div className="flex flex-col space-y-4">
                {field.value ? (
                  <Card className="p-4 bg-muted flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">PDF</Badge>
                      <span className="text-sm font-medium">Resume.pdf</span>
                    </div>
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                    >
                      View
                    </a>
                  </Card>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </div>
              <FormDescription>
                Upload your resume or CV in PDF format (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="min-w-32"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
