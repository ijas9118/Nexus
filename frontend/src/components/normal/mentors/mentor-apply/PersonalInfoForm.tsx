import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import FileUpload from "./FileUpload";
import React from "react";

interface PersonalInfoFormProps {
  onContinue: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onContinue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter your first name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter your last name" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input id="phone" placeholder="Enter your phone number" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, Country" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <div className="flex">
            <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/yourprofile"
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="github">GitHub Profile (optional)</Label>
          <div className="flex">
            <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
              <Github className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="github"
              placeholder="github.com/yourusername"
              className="rounded-l-none"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="profilePhoto">Profile Photo</Label>
          <FileUpload acceptedFileTypes="JPG or PNG, max 2MB" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onContinue}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalInfoForm;
