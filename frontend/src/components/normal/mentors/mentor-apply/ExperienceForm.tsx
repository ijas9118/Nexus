import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { EXPERIENCE_LEVELS, EXPERTISE_AREAS, TECHNOLOGIES } from "./constants";
import FileUpload from "./FileUpload";

interface ExperienceFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onBack,
  onContinue,
}) => {
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
          <Input id="currentRole" placeholder="e.g. Senior Software Engineer" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Company/Organization</Label>
          <Input id="company" placeholder="e.g. Acme Inc." />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Years of Professional Experience</Label>
          <Select>
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
                <Checkbox id={`expertise-${area.value}`} />
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
                <Checkbox id={`tech-${tech.value}`} />
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
