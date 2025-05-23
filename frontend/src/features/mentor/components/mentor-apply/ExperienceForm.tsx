import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Checkbox } from "@/components/atoms/checkbox";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { ArrowRight } from "lucide-react";

import React from "react";
import { useMentorForm } from "@/context/MentorFormContext";
import { useQuery } from "@tanstack/react-query";
import MentorMetadataService from "@/services/mentorMetadataService";

interface ExperienceFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onBack,
  onContinue,
}) => {
  const { form } = useMentorForm();
  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  const { data: experienceLevels } = useQuery({
    queryKey: ["experienceLevels"],
    queryFn: () => MentorMetadataService.getByType("experienceLevel"),
  });

  const { data: expertiseAreaOptions } = useQuery({
    queryKey: ["expertiseAreas"],
    queryFn: () => MentorMetadataService.getByType("expertiseArea"),
  });

  const { data: technologyOptions } = useQuery({
    queryKey: ["technologies"],
    queryFn: () => MentorMetadataService.getByType("technology"),
  });

  const expertiseAreas = watch("experience.expertiseAreas", []);
  const technologies = watch("experience.technologies", []);

  const handleCheckboxChange = (
    field: "expertiseAreas" | "technologies",
    value: string,
    checked: boolean,
  ) => {
    const currentValues =
      field === "expertiseAreas" ? expertiseAreas : technologies;
    let updatedValues = [...currentValues];

    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    setValue(`experience.${field}`, updatedValues, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>
          Tell us about your work experience and skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="currentRole">Current Role</Label>
          <Input
            id="currentRole"
            placeholder="e.g. Senior Software Engineer"
            {...register("experience.currentRole", {
              required: "Current role is required",
            })}
          />
          {errors.experience?.currentRole && (
            <p className="text-sm text-red-500">
              {errors.experience.currentRole.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Company/Organization</Label>
          <Input
            id="company"
            placeholder="e.g. Acme Inc."
            {...register("experience.company", {
              required: "Company is required",
            })}
          />
          {errors.experience?.company && (
            <p className="text-sm text-red-500">
              {errors.experience.company.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Years of Professional Experience</Label>
          {!experienceLevels ? (
            <div>Loading...</div>
          ) : (
            <Select
              onValueChange={(value) =>
                setValue("experience.experienceLevel", value, {
                  shouldValidate: true,
                })
              }
              value={watch("experience.experienceLevel")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level: any) => (
                  <SelectItem key={level._id} value={level._id}>
                    {level.name} ({level.label})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.experience?.experienceLevel && (
            <p className="text-sm text-red-500">
              {errors.experience.experienceLevel.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Areas of Expertise</Label>
          {!expertiseAreaOptions ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {expertiseAreaOptions.map((area: any) => (
                <div key={area._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`expertise-${area._id}`}
                    checked={expertiseAreas.includes(area._id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "expertiseAreas",
                        area._id,
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`expertise-${area._id}`}
                    className="text-sm font-normal"
                  >
                    {area.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {errors.experience?.expertiseAreas && (
            <p className="text-sm text-red-500">
              {errors.experience.expertiseAreas.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Technologies & Languages</Label>
          {!technologyOptions ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {technologyOptions.map((tech: any) => (
                <div key={tech._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech._id}`}
                    checked={technologies.includes(tech._id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "technologies",
                        tech._id,
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`tech-${tech._id}`}
                    className="text-sm font-normal"
                  >
                    {tech.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {errors.experience?.technologies && (
            <p className="text-sm text-red-500">
              {errors.experience.technologies.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Professional Biography</Label>
          <Textarea
            id="bio"
            placeholder="Write a brief description of your professional experience and qualifications..."
            className="min-h-[150px]"
            {...register("experience.bio", {
              required: "Biography is required",
            })}
          />
          <p className="text-sm text-muted-foreground">
            This will be displayed on your mentor profile.
          </p>
          {errors.experience?.bio && (
            <p className="text-sm text-red-500">
              {errors.experience.bio.message}
            </p>
          )}
        </div>

        {/* <div className="grid gap-2">
          <Label htmlFor="resume">Resume/CV (optional)</Label>
          <FileUpload acceptedFileTypes="PDF or DOCX, max 5MB" />
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue} disabled={!isValid}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperienceForm;
