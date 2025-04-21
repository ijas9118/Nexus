"use client";

import type { Control } from "react-hook-form";
import { Briefcase, Code, FileText } from "lucide-react";

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
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";

import { experienceLevels, expertiseAreas, technologies } from "../schema";
import { CardSelect } from "./card-select";
import {
  useExperienceLevels,
  useExpertiseAreas,
  useTechnologies,
} from "../hooks/useMentorshipConfigs";

interface ExperienceTabProps {
  control: Control<any>;
}

export function ExperienceTab({ control }: ExperienceTabProps) {
  const { data: experienceLevels = [], isLoading: loadingExperience } =
    useExperienceLevels();
  const { data: expertiseAreas = [], isLoading: loadingExpertise } =
    useExpertiseAreas();
  const { data: technologies = [], isLoading: loadingTechnologies } =
    useTechnologies();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Position
          </CardTitle>
          <CardDescription>
            Share your current role and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="experience.currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Senior Software Engineer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="experience.company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="experience.experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingExperience}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level._id} value={level.value}>
                        {level.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Expertise Areas
          </CardTitle>
          <CardDescription>Select your areas of expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="experience.expertiseAreas"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CardSelect
                    options={expertiseAreas}
                    selected={field.value}
                    onChange={field.onChange}
                    loading={loadingExpertise}
                  />
                </FormControl>
                <FormDescription className="mt-3">
                  Select the areas where you have professional expertise
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
            <Code className="h-5 w-5" />
            Technologies & Skills
          </CardTitle>
          <CardDescription>
            Select the technologies and skills you're proficient in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="experience.technologies"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CardSelect
                    options={technologies}
                    selected={field.value}
                    onChange={field.onChange}
                    loading={loadingTechnologies}
                  />
                </FormControl>
                <FormDescription className="mt-3">
                  Select the technologies and skills you're proficient in
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
            <FileText className="h-5 w-5" />
            Professional Bio
          </CardTitle>
          <CardDescription>
            Tell potential mentees about your professional background
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="experience.bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your professional journey, achievements, and expertise..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be displayed on your public profile
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
