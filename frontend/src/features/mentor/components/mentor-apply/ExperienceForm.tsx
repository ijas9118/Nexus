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

import FileUpload from "./FileUpload";
import React from "react";
import { useMentorForm } from "@/context/MentorFormContext";
import { useQuery } from "@tanstack/react-query";
import { formatLabel } from "@/utils";
import MentorService from "@/services/mentorService";

interface ExperienceFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onBack,
  onContinue,
}) => {
  const { formData, setFormData } = useMentorForm();

  const { data: enums, isLoading } = useQuery({
    queryKey: ["mentorEnums"],
    queryFn: MentorService.getMentorEnums,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [id]: value,
      },
    }));
  };

  const handleExperienceLevelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        experienceLevel: value,
      },
    }));
  };

  const handleCheckboxChange = (
    field: "expertiseAreas" | "technologies",
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = prev.experience[field];
      let updatedValues = [...currentValues];

      if (checked) {
        // Add value if checked
        updatedValues.push(value);
      } else {
        // Remove value if unchecked
        updatedValues = updatedValues.filter((item) => item !== value);
      }

      return {
        ...prev,
        experience: {
          ...prev.experience,
          [field]: updatedValues,
        },
      };
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        bio: value,
      },
    }));
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
            value={formData.experience.currentRole}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Company/Organization</Label>
          <Input
            id="company"
            placeholder="e.g. Acme Inc."
            value={formData.experience.company}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Years of Professional Experience</Label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Select
              onValueChange={handleExperienceLevelChange}
              value={formData.experience.experienceLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {enums?.experienceLevels.map((level: any, index: number) => (
                  <SelectItem key={index} value={level}>
                    {formatLabel(level)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Areas of Expertise</Label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {enums?.expertiseAreas?.map((area: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`expertise-${area}`}
                    checked={formData.experience.expertiseAreas.includes(area)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "expertiseAreas",
                        area,
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`expertise-${area}`}
                    className="text-sm font-normal"
                  >
                    {formatLabel(area)}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Technologies & Languages</Label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {enums?.technologies?.map((tech: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech}`}
                    checked={formData.experience.technologies.includes(tech)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "technologies",
                        tech,
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`tech-${tech}`}
                    className="text-sm font-normal"
                  >
                    {formatLabel(tech)}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Professional Biography</Label>
          <Textarea
            id="bio"
            placeholder="Write a brief description of your professional experience and qualifications..."
            className="min-h-[150px]"
            value={formData.experience.bio}
            onChange={handleBioChange}
          />
          <p className="text-sm text-muted-foreground">
            This will be displayed on your mentor profile.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="resume">Resume/CV (optional)</Label>
          <FileUpload acceptedFileTypes="PDF or DOCX, max 5MB" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExperienceForm;
