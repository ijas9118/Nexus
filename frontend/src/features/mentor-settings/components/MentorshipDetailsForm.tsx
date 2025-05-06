import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/atoms/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { toast } from "sonner";
import { MultiSelect } from "./multi-select";
import MentorshipTypeService from "@/services/mentorshipTypeService";
import TargetAudienceService, {
  TargetAudienceData,
} from "@/services/targetAudienceService";

// Mock service for updating mentor
const updateMentorshipDetails = async (data: any) => {
  // This would be a real API call
  console.log("Updating mentorship details:", data);
  return data;
};

const mentorshipFormSchema = z.object({
  mentorshipTypes: z.array(z.string()).min(1, {
    message: "Please select at least one mentorship type.",
  }),
  targetAudiences: z.array(z.string()).min(1, {
    message: "Please select at least one target audience.",
  }),
  availabilityType: z.enum(["weekdays", "weekend", "both"], {
    required_error: "Please select your availability.",
  }),
  motivation: z
    .string()
    .min(50, {
      message: "Motivation must be at least 50 characters.",
    })
    .max(500, {
      message: "Motivation must not exceed 500 characters.",
    }),
});

type MentorshipFormValues = z.infer<typeof mentorshipFormSchema>;

export default function MentorshipDetailsForm({
  mentorData,
}: {
  mentorData: any;
}) {
  const queryClient = useQueryClient();

  // Fetch mentorship types
  const { data: mentorshipTypes = [] } = useQuery({
    queryKey: ["mentorshipTypes"],
    queryFn: () => MentorshipTypeService.getAllTypes(),
  });

  // Fetch mentorship types
  const { data: targetAudiences = [] } = useQuery({
    queryKey: ["targetAudience"],
    queryFn: () => TargetAudienceService.getAll(),
  });

  console.log(targetAudiences);
  // Set up mutation
  const mutation = useMutation({
    mutationFn: updateMentorshipDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorDetails"] });
      toast.success("Mentorship details updated", {
        description:
          "Your mentorship preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description:
          "There was an error updating your mentorship details. Please try again.",
      });
    },
  });

  // Set up form with default values from mentor data
  const form = useForm<MentorshipFormValues>({
    resolver: zodResolver(mentorshipFormSchema),
    defaultValues: {
      mentorshipTypes:
        mentorData?.mentorshipDetails?.mentorshipTypes?.map(
          (type: any) => type._id,
        ) || [],
      targetAudiences: mentorData?.mentorshipDetails?.targetAudiences || [],
      availabilityType:
        mentorData?.mentorshipDetails?.availabilityType || "both",
      motivation: mentorData?.mentorshipDetails?.motivation || "",
    },
  });

  function onSubmit(values: MentorshipFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mentorshipTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mentorship Types</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={mentorshipTypes.map((type: any) => ({
                    value: type._id,
                    label: type.name,
                  }))}
                  onChange={field.onChange}
                  placeholder="Select mentorship types"
                />
              </FormControl>
              <FormDescription>
                Select the types of mentorship you want to provide.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudiences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={targetAudiences.map(
                    (audience: TargetAudienceData) => ({
                      value: audience._id,
                      label: audience.name,
                    }),
                  )}
                  onChange={field.onChange}
                  placeholder="Select target audiences"
                />
              </FormControl>
              <FormDescription>
                Select the types of mentees you want to help.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availabilityType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="weekdays" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Weekdays
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="weekend" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Weekends
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="both" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Both
                      </FormLabel>
                    </FormItem>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                When are you generally available for mentorship sessions?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivation for Mentoring</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share why you want to be a mentor and what you hope to achieve..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain your motivation for becoming a mentor and what you hope
                to contribute.
                <span className="ml-1 text-sm font-medium">
                  {field.value.length}/500
                </span>
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
