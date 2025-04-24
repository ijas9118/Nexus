import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import FileUpload from "./FileUpload";
import React, { useEffect } from "react";
import { useMentorForm } from "@/context/MentorFormContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface PersonalInfoFormProps {
  onContinue: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onContinue }) => {
  const { form } = useMentorForm();
  const {
    register,
    formState: { errors, isValid },
    setValue,
  } = form;
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      const [firstName, ...rest] = user.name?.split(" ") ?? [];
      const lastName = rest.join(" ");

      const findSocial = (platform: string) =>
        user.socials?.find((s) => s.platform === platform)?.url || "";

      setValue("personalInfo.firstName", firstName);
      setValue("personalInfo.lastName", lastName);
      setValue("personalInfo.email", user.email || "");
      setValue("personalInfo.location", user.location || "");
      setValue("personalInfo.linkedin", findSocial("linkedin"));
      setValue("personalInfo.github", findSocial("github"));
      setValue("personalInfo.phone", user.phone || "");
    }
  }, [user, setValue]);

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
            <Input
              id="firstName"
              placeholder="Enter your first name"
              {...register("personalInfo.firstName", {
                required: "First name is required",
              })}
            />
            {errors.personalInfo?.firstName && (
              <p className="text-sm text-red-500">
                {errors.personalInfo.firstName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              {...register("personalInfo.lastName", {
                required: "Last name is required",
              })}
            />
            {errors.personalInfo?.lastName && (
              <p className="text-sm text-red-500">
                {errors.personalInfo.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("personalInfo.email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            disabled
          />
          {errors.personalInfo?.email && (
            <p className="text-sm text-red-500">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            {...register("personalInfo.phone")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, Country"
            {...register("personalInfo.location")}
          />
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
              {...register("personalInfo.linkedin")}
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
              {...register("personalInfo.github")}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="profilePhoto">Profile Photo</Label>
          <FileUpload acceptedFileTypes="JPG or PNG, max 2MB" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onContinue} disabled={!isValid}>
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalInfoForm;
