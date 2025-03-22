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
import { EXPERIENCE_LEVELS, EXPERTISE_AREAS, TECHNOLOGIES } from "../constants";

interface ExperienceFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onBack,
  onContinue,
}) => {
  const { formData, setFormData } = useMentorForm();

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
      const updatedValues = checked
        ? [...currentValues, value] // Add value if checked
        : currentValues.filter((item) => item !== value); // Remove value if unchecked

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
          <Select
            onValueChange={handleExperienceLevelChange}
            value={formData.experience.experienceLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Areas of Expertise</Label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERTISE_AREAS.map((area) => (
              <div key={area.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`expertise-${area.value}`}
                  checked={formData.experience.expertiseAreas.includes(
                    area.value,
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "expertiseAreas",
                      area.value,
                      checked === true,
                    )
                  }
                />
                <Label
                  htmlFor={`expertise-${area.value}`}
                  className="text-sm font-normal"
                >
                  {area.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Technologies & Languages</Label>
          <div className="grid grid-cols-3 gap-2">
            {TECHNOLOGIES.map((tech) => (
              <div key={tech.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tech-${tech.value}`}
                  checked={formData.experience.technologies.includes(
                    tech.value,
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "technologies",
                      tech.value,
                      checked === true,
                    )
                  }
                />
                <Label
                  htmlFor={`tech-${tech.value}`}
                  className="text-sm font-normal"
                >
                  {tech.label}
                </Label>
              </div>
            ))}
          </div>
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
