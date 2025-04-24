import type { Control } from "react-hook-form";
import { GraduationCap, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/form";
import { Textarea } from "@/components/atoms/textarea";
import { CardSelect } from "./card-select";
import {
  useMentorshipTypes,
  useTargetAudience,
} from "../hooks/useMentorshipConfigs";

interface MentorshipTabProps {
  control: Control<any>;
}

export function MentorshipTab({ control }: MentorshipTabProps) {
  const { data: mentorshipTypes = [], isLoading: loadingMentorshipTypes } =
    useMentorshipTypes();

  const { data: targetAudiences = [], isLoading: loadingTargetAudience } =
    useTargetAudience();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Mentorship Types
          </CardTitle>
          <CardDescription>
            Select the types of mentorship you're willing to provide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="mentorshipDetails.mentorshipTypes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CardSelect
                    options={mentorshipTypes}
                    selected={field.value}
                    onChange={field.onChange}
                    loading={loadingMentorshipTypes}
                  />
                </FormControl>
                <FormDescription className="mt-3">
                  Select the types of mentorship you're willing to provide
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Target Audience
          </CardTitle>
          <CardDescription>
            Select the groups you're most interested in mentoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="mentorshipDetails.targetAudiences"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CardSelect
                    options={targetAudiences}
                    selected={field.value}
                    onChange={field.onChange}
                    loading={loadingTargetAudience}
                  />
                </FormControl>
                <FormDescription className="mt-3">
                  Select the groups you're most interested in mentoring
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Motivation
          </CardTitle>
          <CardDescription>Share why you want to be a mentor</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="mentorshipDetails.motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivation for Mentoring</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share why you want to mentor others and what you hope to achieve..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This helps mentees understand your motivation and approach
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
