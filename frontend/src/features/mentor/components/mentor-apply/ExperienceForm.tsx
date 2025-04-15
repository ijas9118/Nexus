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
import { MentorConfigService } from "@/services/mentorConfigService";
import { MentorshipConfig } from "@/types/mentor";
import { formatLabel } from "@/utils";

interface ExperienceFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onBack,
  onContinue,
}) => {
  const { formData, setFormData } = useMentorForm();

  const { data: experienceLevels = [], isLoading: isLoadingLevels } = useQuery({
    queryKey: ["experienceLevels"],
    queryFn: () => MentorConfigService.getConfigsByCategory("experienceLevel"),
  });

  const { data: expertiseAreas = [], isLoading: isLoadingAreas } = useQuery({
    queryKey: ["expertiseAreas"],
    queryFn: () => MentorConfigService.getConfigsByCategory("expertiseArea"),
  });

  const { data: technologies = [], isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: () => MentorConfigService.getConfigsByCategory("technology"),
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
          {isLoadingLevels ? (
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
                {experienceLevels.map((level: MentorshipConfig) => (
                  <SelectItem key={level._id} value={level._id}>
                    {level.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Areas of Expertise</Label>
          {isLoadingAreas ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {expertiseAreas.map((area: MentorshipConfig) => (
                <div key={area._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`expertise-${area._id}`}
                    checked={formData.experience.expertiseAreas.includes(
                      area._id,
                    )}
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
                    {formatLabel(area.value)}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Technologies & Languages</Label>
          {isLoadingTechs ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {technologies.map((tech: MentorshipConfig) => (
                <div key={tech._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech._id}`}
                    checked={formData.experience.technologies.includes(
                      tech._id,
                    )}
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
                    {formatLabel(tech.value)}
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
