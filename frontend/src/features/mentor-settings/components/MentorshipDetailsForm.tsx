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
import { MultiSelect } from "./multi-select";
import { useMentorshipForm } from "../hooks/useMentorshipForm";

export default function MentorshipDetailsForm({ mentorData }: any) {
  const {
    form,
    mentorshipTypeOptions,
    targetAudienceOptions,
    isLoading,
    mutation,
    handleSubmit,
  } = useMentorshipForm({ mentorData });

  if (isLoading) {
    return <div>Loading mentorship options...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="mentorshipTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mentorship Types</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={mentorshipTypeOptions}
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
                  options={targetAudienceOptions}
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
